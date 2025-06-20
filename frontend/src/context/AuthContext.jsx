import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Action types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    REGISTER_START: 'REGISTER_START',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    LOGOUT: 'LOGOUT',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_LOADING: 'SET_LOADING',
    RESTORE_SESSION: 'RESTORE_SESSION',
};

// Reducer function
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.REGISTER_START:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
        case AUTH_ACTIONS.REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.REGISTER_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };

        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };

        case AUTH_ACTIONS.RESTORE_SESSION:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
            };

        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Restore session on app load
    useEffect(() => {
        const restoreSession = () => {
            try {
                const token = localStorage.getItem('authToken');
                const user = localStorage.getItem('user');

                if (token && user) {
                    dispatch({
                        type: AUTH_ACTIONS.RESTORE_SESSION,
                        payload: {
                            token,
                            user: JSON.parse(user),
                        },
                    });
                } else {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                }
            } catch (error) {
                console.error('Error restoring session:', error);
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        };

        restoreSession();
    }, []); // This useEffect is correct as it only needs to run once.

    // Login function (memoized with useCallback)
    const login = useCallback(async (credentials) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            const response = await authAPI.login(credentials);
            
            if (response.success) {
                const { user, token } = response.data;
                
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));

                dispatch({
                    type: AUTH_ACTIONS.LOGIN_SUCCESS,
                    payload: { user, token },
                });

                return { success: true, data: response.data };
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            const errorMessage = error.message || 'Login failed';
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: errorMessage,
            });
            return { success: false, error: errorMessage };
        }
    }, []); // Empty dependency array as it doesn't depend on component state or props

    // Register function (memoized with useCallback)
    const register = useCallback(async (userData) => {
        dispatch({ type: AUTH_ACTIONS.REGISTER_START });

        try {
            const response = await authAPI.register(userData);
            
            if (response.success) {
                const { user, token } = response.data;
                
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));

                dispatch({
                    type: AUTH_ACTIONS.REGISTER_SUCCESS,
                    payload: { user, token },
                });

                return { success: true, data: response.data };
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error) {
            const errorMessage = error.message || 'Registration failed';
            dispatch({
                type: AUTH_ACTIONS.REGISTER_FAILURE,
                payload: errorMessage,
            });
            return { success: false, error: errorMessage };
        }
    }, []); // Empty dependency array

    // Logout function (memoized with useCallback)
    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }, []); // Empty dependency array

    // Clear error function (memoized with useCallback)
    const clearError = useCallback(() => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    }, []); // Empty dependency array

    // Context value (memoized with useMemo)
    const value = useMemo(() => ({
        ...state,
        login,
        register,
        logout,
        clearError,
    }), [state, login, register, logout, clearError]); // Dependencies are the state and the memoized functions

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;