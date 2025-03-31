const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
            await cart.save();
        }
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const existingItem = cart.items.find(item => 
            item.product.toString() === productId
        );

        if (existingItem) {
            if (product.stock < (existingItem.quantity + quantity)) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        await cart.save();
        await Product.findByIdAndUpdate(productId, {
            $inc: { inCartCount: quantity }
        });

        await cart.populate('items.product');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart' });
    }
});

// Update cart item quantity
router.put('/update', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // Validate inputs
        if (!productId || quantity === undefined) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItem = cart.items.find(item => 
            item.product.toString() === productId
        );
        
        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update quantity
        cartItem.quantity = quantity;
        await cart.save();
        
        // Populate product details before sending response
        await cart.populate('items.product');
        
        res.json(cart);
    } catch (error) {
        console.error('Cart update error:', error);
        res.status(500).json({ message: 'Error updating cart' });
    }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.product.toString() === req.params.productId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        await Product.findByIdAndUpdate(req.params.productId, {
            $inc: { inCartCount: -item.quantity }
        });

        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
        await cart.save();
        
        await cart.populate('items.product');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart' });
    }
});

module.exports = router; 