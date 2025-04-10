import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is logged in on page load
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
            // Fetch latest user data
            getUserProfile();
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setError(null);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
    };

    const getUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.get('/api/users/profile');
            setUser({
                ...data,
                phone: data.phone || ''
            });
            localStorage.setItem('user', JSON.stringify(data));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = async (updateData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.put('/api/users/profile', updateData);
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.put('/api/users/change-password', { 
                currentPassword, 
                newPassword 
            });
            return data.success;
        } catch (error) {
            console.error('Password change error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async () => {
        try {
            setLoading(true);
            setError(null);
            await api.delete('/api/users/delete-account');
            logout();
            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            loading,
            error,
            login, 
            logout,
            getUserProfile,
            updateUserProfile,
            changePassword,
            deleteAccount
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 