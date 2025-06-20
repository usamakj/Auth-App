import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API functions
export const authAPI = {
    // Register new user
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Get user profile
    getProfile: async () => {
        try {
            const response = await api.get('/auth/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get profile' };
        }
    },

    // Check email/username availability
    checkAvailability: async (data) => {
        try {
            const response = await api.post('/auth/check-availability', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Availability check failed' };
        }
    },
};

// Comments API functions
export const commentsAPI = {
    // Get all comments
    getComments: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/comments?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get comments' };
        }
    },

    // Create new comment
    createComment: async (content) => {
        try {
            const response = await api.post('/comments', { content });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create comment' };
        }
    },

    // Get user comments
    getUserComments: async (userId, page = 1, limit = 10) => {
        try {
            const response = await api.get(`/comments/user/${userId}?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get user comments' };
        }
    },

    // Delete comment
    deleteComment: async (commentId) => {
        try {
            const response = await api.delete(`/comments/${commentId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete comment' };
        }
    },
};

export default api;

