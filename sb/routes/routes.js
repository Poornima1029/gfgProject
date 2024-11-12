const { Router } = require('express');
const { hash, compare } = require('bcryptjs');
const User = require('../models/User');
const authenticateUser = require('./middleware/authenticate'); // Ensure this is properly set up

const router = Router();

router.post('/reset-password', async (req, res) => {
    const { username, securityAnswer, newPassword } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided security answer with the stored hashed answer
        const isMatch = await compare(securityAnswer, user.securityAnswer);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid security answer' });
        }

        // Hash the new password and update it in the database
        const hashedPassword = await hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/api/settings', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('username email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ username: user.username, email: user.email });
    } catch (error) {
        console.error('Error fetching user settings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
