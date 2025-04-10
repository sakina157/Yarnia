const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userController = {
    // Get user profile
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    },

    // Update user profile
    updateProfile: async (req, res) => {
        try {
            const { email, name, phone } = req.body;
            
            // Validate the data
            if (!email || !name || !phone) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Please provide all required fields' 
                });
            }

            // Check if email already exists for another user
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: req.user.id } 
            });
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }

            const user = await User.findByIdAndUpdate(
                req.user.id,
                { 
                    $set: { email, name, phone } 
                },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    message: 'User not found' 
                });
            }

            res.json(user);
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            
            // Find user with password field
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Generate salt and hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password directly in database
            await User.findByIdAndUpdate(req.user.id, {
                $set: { password: hashedPassword }
            });

            res.json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'Server Error'
            });
        }
    },

    deleteAccount: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.user.id);
            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

module.exports = userController; 