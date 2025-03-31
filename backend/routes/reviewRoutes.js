const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/authMiddleware');

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        
        // Calculate average rating
        const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
        
        res.json({
            reviews,
            avgRating: isNaN(avgRating) ? 0 : avgRating,
            total: reviews.length
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

// Add a review
router.post('/', auth, async (req, res) => {
    try {
        const { productId, rating, review } = req.body;
        if (!productId || !rating || !review) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            product: productId,
            user: req.user.id
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const newReview = new Review({
            product: productId,
            user: req.user.id,
            rating,
            review
        });

        await newReview.save();
        
        const populatedReview = await Review.findById(newReview._id)
            .populate('user', 'name');

        res.status(201).json(populatedReview);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review' });
    }
});

// Update a review
router.put('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        review.rating = req.body.rating || review.rating;
        review.review = req.body.review || review.review;
        
        await review.save();
        
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error updating review' });
    }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await review.remove();
        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review' });
    }
});

// Add this new route to get featured reviews
router.get('/featured', async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'name')
            .sort({ rating: -1, createdAt: -1 })
            .limit(3);
        
        res.json({ reviews });
    } catch (error) {
        console.error('Error fetching featured reviews:', error);
        res.status(500).json({ message: 'Error fetching featured reviews' });
    }
});

module.exports = router; 