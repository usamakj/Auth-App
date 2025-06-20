import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, MessageCircle, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { commentsAPI } from '../services/api';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Load comments on component mount
    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        try {
            setIsLoadingComments(true);
            const response = await commentsAPI.getComments(1, 20);
            
            if (response.success) {
                setComments(response.data.comments);
            }
        } catch (error) {
            console.error('Failed to load comments:', error);
            setError('Failed to load comments');
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        try {
            setIsSubmittingComment(true);
            setError('');
            
            const response = await commentsAPI.createComment(newComment.trim());
            
            if (response.success) {
                setSuccess('Comment posted successfully!');
                setNewComment('');
                // Add new comment to the beginning of the list
                setComments(prev => [response.data.comment, ...prev]);
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
            setError(error.message || 'Failed to post comment');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await commentsAPI.deleteComment(commentId);
            
            if (response.success) {
                setComments(prev => prev.filter(comment => comment._id !== commentId));
                setSuccess('Comment deleted successfully!');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
            setError(error.message || 'Failed to delete comment');
        }
    };

    const handleLogout = () => {
        logout();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                MERN Auth Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Welcome, {user?.firstName} {user?.lastName}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="flex items-center"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    {/* User Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MessageCircle className="h-5 w-5 mr-2" />
                                User Profile
                            </CardTitle>
                            <CardDescription>
                                Your account information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="text-lg">{user?.firstName} {user?.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Username</p>
                                    <p className="text-lg">{user?.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-lg">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                                    <p className="text-lg">{formatDate(user?.createdAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comment Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Post a Comment</CardTitle>
                            <CardDescription>
                                Share your thoughts with the community
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            
                            {success && (
                                <Alert className="mb-4 border-green-200 bg-green-50">
                                    <AlertDescription className="text-green-800">
                                        {success}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmitComment} className="space-y-4">
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="What's on your mind?"
                                    className="min-h-[100px]"
                                    maxLength={500}
                                />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        {newComment.length}/500 characters
                                    </span>
                                    <Button
                                        type="submit"
                                        disabled={isSubmittingComment || !newComment.trim()}
                                    >
                                        {isSubmittingComment ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Posting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Post Comment
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Comments List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Comments</CardTitle>
                            <CardDescription>
                                Latest comments from the community
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingComments ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span className="ml-2">Loading comments...</span>
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No comments yet. Be the first to post!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <motion.div
                                            key={comment._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="border rounded-lg p-4 bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">
                                                        {comment.authorName}
                                                    </span>
                                                    {comment.author._id === user?._id && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            You
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(comment.createdAt)}
                                                    </span>
                                                    {comment.author._id === user?._id && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-700">{comment.content}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
};

export default DashboardPage;

