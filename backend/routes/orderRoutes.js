const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');
const Razorpay = require('razorpay');

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Order routes are working' });
});

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new order
router.post('/', auth, async (req, res) => {
    try {
        const { shippingAddress } = req.body;
        
        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        
        // Calculate prices
        const itemsPrice = cart.total;
        const shippingPrice = 100; // Fixed shipping price for now
        const taxPrice = Math.round(itemsPrice * 0.18); // 18% tax
        const totalPrice = itemsPrice + shippingPrice + taxPrice;
        
        // Create order
        const order = new Order({
            user: req.user.id,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price || item.product.price
            })),
            shippingAddress,
            paymentMethod: 'razorpay',
            totalPrice,
            shippingPrice,
            taxPrice
        });
        
        // Save order
        await order.save();
        
        try {
            // Create Razorpay order with proper configuration
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalPrice * 100), // Convert to paise and ensure it's a whole number
                currency: 'INR',
                receipt: order._id.toString(),
                payment_capture: 1,
                notes: {
                    shipping_address: shippingAddress.address,
                    order_id: order._id.toString()
                }
            });
            
            // Clear cart
            cart.items = [];
            cart.total = 0;
            await cart.save();
            
            // Update product stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity, inCartCount: -item.quantity }
                });
            }
            
            res.status(201).json({
                success: true,
                order,
                razorpayOrderId: razorpayOrder.id,
                razorpayKeyId: process.env.RAZORPAY_KEY_ID,
                amount: Math.round(totalPrice * 100),
                currency: 'INR'
            });
        } catch (razorpayError) {
            // If Razorpay order creation fails, delete the order and restore cart
            await Order.findByIdAndDelete(order._id);
            cart.items = order.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price
            }));
            cart.total = itemsPrice;
            await cart.save();
            
            console.error('Razorpay Error:', razorpayError);
            return res.status(500).json({ 
                success: false,
                message: 'Payment gateway error. Please try again.',
                error: razorpayError.message
            });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Check if the order belongs to the user
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order' });
    }
});

// Get all orders for a user
router.get('/user/orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Update order payment status
router.post('/:id/pay', auth, async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Check if the order belongs to the user
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        // Update order payment status
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: razorpay_payment_id,
            status: 'completed',
            update_time: new Date().toISOString(),
            email_address: req.user.email
        };
        
        await order.save();
        
        res.json({ message: 'Payment successful', order });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ message: 'Error updating payment status' });
    }
});

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Update order status (admin only)
router.put('/:id/status', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const { status, trackingNumber } = req.body;
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        order.status = status;
        
        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }
        
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        
        await order.save();
        
        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status' });
    }
});

module.exports = router; 