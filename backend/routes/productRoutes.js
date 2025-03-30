const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const adminMiddleware = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, 'product-' + Date.now() + path.extname(file.originalname));
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

// Initialize multer with configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// Public routes
router.get('/', async (req, res) => {
    try {
        const { category, sort, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let products = await Product.find(query);

        if (sort) {
            switch (sort) {
                case 'price_asc':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'newest':
                    products.sort((a, b) => b.createdAt - a.createdAt);
                    break;
                case 'popular':
                    products.sort((a, b) => b.inCartCount - a.inCartCount);
                    break;
            }
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Admin routes
router.post('/', adminMiddleware, upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, price, category, stock } = req.body;
        const images = req.files.map(file => `/uploads/${file.filename}`);

        const product = new Product({
            title,
            description,
            price,
            category,
            stock,
            images
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
});

// Other admin routes for update and delete
// ... will add these next

// Add this route with your other routes
router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

router.put('/:id', adminMiddleware, upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, price, category, stock } = req.body;
        const updateData = {
            title,
            description,
            price,
            category,
            stock
        };

        // Only update images if new ones are uploaded
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `/uploads/${file.filename}`);
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

module.exports = router; 