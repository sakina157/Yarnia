const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const adminMiddleware = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function(req, file, cb) {
        // Sanitize filename
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, 'product-' + Date.now() + '-' + sanitizedFilename);
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

router.get('/search', async (req, res) => {
    try {
        const { q, category } = req.query;
        let query = {};

        if (q) {
            // Create search query for multiple fields
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ];
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        const products = await Product.find(query)
            .select('title description price images category stock') // Select only needed fields
            .limit(20); // Limit results for better performance

        // Group results by category for better organization
        const groupedResults = products.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
        }, {});

        res.json({
            results: products,
            groupedResults,
            total: products.length
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching products' });
    }
});

// Admin routes
router.post('/', adminMiddleware, upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, price, category, stock } = req.body;
        
        // Validate required fields
        if (!title || !description || !price || !category || !stock) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                details: {
                    title: !title ? 'Title is required' : null,
                    description: !description ? 'Description is required' : null,
                    price: !price ? 'Price is required' : null,
                    category: !category ? 'Category is required' : null,
                    stock: !stock ? 'Stock is required' : null
                }
            });
        }

        // Validate file upload
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        // Convert and validate price and stock
        const numericPrice = Number(price);
        const numericStock = Number(stock);

        if (isNaN(numericPrice) || numericPrice <= 0 || numericPrice > 1000000) {
            return res.status(400).json({ message: 'Invalid price value. Price must be between 1 and 1,000,000' });
        }

        if (isNaN(numericStock) || numericStock < 0 || numericStock > 10000) {
            return res.status(400).json({ message: 'Invalid stock value. Stock must be between 0 and 10,000' });
        }

        // Process image paths
        const images = req.files.map(file => `/uploads/${file.filename}`);

        const product = new Product({
            title: title.trim(),
            description: description.trim(),
            price: numericPrice,
            category: category.trim(),
            stock: numericStock,
            images
        });

        const savedProduct = await product.save();
        console.log('Product created successfully:', savedProduct);
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error',
                details: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ 
            message: 'Error creating product',
            error: error.message 
        });
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

        // Convert and validate price and stock
        const numericPrice = Number(price);
        const numericStock = Number(stock);

        if (isNaN(numericPrice) || numericPrice <= 0 || numericPrice > 1000000) {
            return res.status(400).json({ message: 'Invalid price value. Price must be between 1 and 1,000,000' });
        }

        if (isNaN(numericStock) || numericStock < 0 || numericStock > 10000) {
            return res.status(400).json({ message: 'Invalid stock value. Stock must be between 0 and 10,000' });
        }

        const updateData = {
            title: title.trim(),
            description: description.trim(),
            price: numericPrice,
            category: category.trim(),
            stock: numericStock
        };

        // Only update images if new ones are uploaded
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `/uploads/${file.filename}`);
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product updated successfully:', product);
        res.json(product);
    } catch (error) {
        console.error('Update error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error',
                details: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Error updating product' });
    }
});

// Move the related products route BEFORE the :id route
router.get('/related-products', async (req, res) => {
    try {
        const { category, exclude } = req.query;
        
        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        const relatedProducts = await Product.find({
            category: category,
            _id: { $ne: exclude }
        })
        .select('title price images')
        .limit(4);
        
        res.json(relatedProducts);
    } catch (error) {
        console.error('Error fetching related products:', error);
        res.status(500).json({ message: 'Error fetching related products' });
    }
});

// Then keep your existing product by ID route
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product details' });
    }
});

module.exports = router; 