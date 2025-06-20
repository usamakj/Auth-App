const express = require('express');
const Comment = require('../models/Comment');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/comments
// @desc    Create a new comment
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;

        // Validation
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }

        // Create new comment
        const newComment = new Comment({
            content: content.trim(),
            author: req.user._id,
            authorName: `${req.user.firstName} ${req.user.lastName}`
        });

        // Save comment to database
        const savedComment = await newComment.save();

        // Populate author details for response
        await savedComment.populate('author', 'username firstName lastName');

        res.status(201).json({
            success: true,
            message: 'Comment posted successfully',
            data: {
                comment: savedComment
            }
        });

    } catch (error) {
        console.error('Comment creation error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error while posting comment'
        });
    }
});

// @route   GET /api/comments
// @desc    Get all comments
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get comments with pagination
        const comments = await Comment.find({ isActive: true })
            .populate('author', 'username firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalComments = await Comment.countDocuments({ isActive: true });
        const totalPages = Math.ceil(totalComments / limit);

        res.status(200).json({
            success: true,
            message: 'Comments retrieved successfully',
            data: {
                comments,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalComments,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Comments retrieval error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while retrieving comments'
        });
    }
});

// @route   GET /api/comments/user/:userId
// @desc    Get comments by specific user
// @access  Public
router.get('/user/:userId', optionalAuth, async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get user's comments with pagination
        const comments = await Comment.find({ 
            author: userId, 
            isActive: true 
        })
            .populate('author', 'username firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalComments = await Comment.countDocuments({ 
            author: userId, 
            isActive: true 
        });
        const totalPages = Math.ceil(totalComments / limit);

        res.status(200).json({
            success: true,
            message: 'User comments retrieved successfully',
            data: {
                comments,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalComments,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('User comments retrieval error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while retrieving user comments'
        });
    }
});

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment (soft delete)
// @access  Private (only comment author)
router.delete('/:commentId', authenticateToken, async (req, res) => {
    try {
        const { commentId } = req.params;

        // Find comment
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is the author of the comment
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own comments'
            });
        }

        // Soft delete (mark as inactive)
        comment.isActive = false;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });

    } catch (error) {
        console.error('Comment deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting comment'
        });
    }
});

module.exports = router;

