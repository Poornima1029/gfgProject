const { Router } = require('express');
const { hash, compare } = require('bcryptjs');
const User = require('../models/User'); // Adjust the path as necessary
const { sign } = require('jsonwebtoken');

const router = Router();

// Sign up route
router.post('/signup', async (req, res) => {
    const { username, email, password, securityQuestion, securityAnswer } = req.body;

    // Check for missing fields
    if (!username || !email || !password || !securityAnswer) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Hash password and security answer
        const hashedPassword = await hash(password, 10);
        const hashedAnswer = await hash(securityAnswer, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            securityQuestion,
            securityAnswer: hashedAnswer,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Login route
router.post('/login', async (req, res) => {
    console.log('Login request received:', req.body); // Log the incoming request

    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username); // Log if the user is not found
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', username); // Log if password does not match
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful for user:', username); // Log successful login
        res.status(200).json({ token, message: 'Login successful' });
    } catch (err) {
        console.error('Login error:', err); // Log any error
        res.status(500).json({ message: err.message });
    }
});



module.exports = router; // Use CommonJS export
