const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { phone, email, password, acceptedTerms } = req.body;

        // Validate required fields
        if (!phone || !email || !password || acceptedTerms === undefined) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate phone number format
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format. Must be 10 digits.'
            });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email 
                    ? 'Email already registered' 
                    : 'Phone number already registered'
            });
        }

        // Create new user
        const user = await User.create({
            phone,
            email,
            password,
            acceptedTerms
        });

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating account. Please try again later.'
        });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password using bcrypt.compare
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in'
        });
    }
});

module.exports = router; 