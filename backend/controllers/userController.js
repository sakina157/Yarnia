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
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: { email, name, phone } },
                { new: true }
            ).select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findById(req.user.id);

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
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