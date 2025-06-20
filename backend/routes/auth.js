const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        // Validation
        if (!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists by email
        const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingUserByEmail) {
            return res.status(409).json({
                success: false,
                message: 'User already registered with this email address'
            });
        }

        // Check if user already exists by username
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(409).json({
                success: false,
                message: 'Username is already taken'
            });
        }

        // Create new user
        const newUser = new User({
            username,
            email: email.toLowerCase(),
            password,
            firstName,
            lastName
        });

        // Save user to database
        const savedUser = await newUser.save();

        // Generate JWT token
        const token = generateToken(savedUser._id);

        // Return success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: savedUser.toJSON(),
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                success: false,
                message: `User already registered with this ${field}`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or username

        // Validation
        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/username and password are required'
            });
        }

        // Find user by email or username
        const user = await User.findByEmailOrUsername(identifier);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toJSON(),
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                user: req.user
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// @route   POST /api/auth/check-availability
// @desc    Check if email or username is available
// @access  Public
router.post('/check-availability', async (req, res) => {
    try {
        const { email, username } = req.body;

        const checks = {};

        if (email) {
            const emailExists = await User.findOne({ email: email.toLowerCase() });
            checks.email = {
                available: !emailExists,
                message: emailExists ? 'Email is already registered' : 'Email is available'
            };
        }

        if (username) {
            const usernameExists = await User.findOne({ username });
            checks.username = {
                available: !usernameExists,
                message: usernameExists ? 'Username is already taken' : 'Username is available'
            };
        }

        res.status(200).json({
            success: true,
            message: 'Availability check completed',
            data: checks
        });

    } catch (error) {
        console.error('Availability check error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;

