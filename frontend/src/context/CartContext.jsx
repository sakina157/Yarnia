import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            // Load cart from localStorage when not authenticated
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            } else {
                setCart({ items: [], total: 0 });
            }
        }
    }, [isAuthenticated]);

    // Save cart to localStorage whenever it changes (for non-authenticated users)
    useEffect(() => {
        if (!isAuthenticated && cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.get('/api/cart');
            setCart(data || { items: [], total: 0 });
        } catch (err) {
            setError(err.message);
            console.error('Error fetching cart:', err);
            setCart({ items: [], total: 0 });
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            if (isAuthenticated) {
                const data = await api.post('/api/cart/add', { productId, quantity });
                setCart(data);
                return { success: true, message: 'Added to cart!' };
            } else {
                // Handle local cart
                const existingItem = cart.items.find(item => item.productId === productId);
                if (existingItem) {
                    setCart({
                        ...cart,
                        items: cart.items.map(item =>
                            item.productId === productId
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    });
                } else {
                    setCart({
                        ...cart,
                        items: [...cart.items, { productId, quantity }]
                    });
                }
                return { success: true, message: 'Added to cart!' };
            }
        } catch (err) {
            setError(err.message);
            console.error('Error adding to cart:', err);
            return { success: false, message: err.message || 'Error adding to cart' };
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            setLoading(true);
            setError(null);

            if (isAuthenticated) {
                const data = await api.delete(`/api/cart/remove/${productId}`);
                setCart(data);
            } else {
                setCart({
                    ...cart,
                    items: cart.items.filter(item => item.productId !== productId)
                });
            }
            return { success: true };
        } catch (err) {
            setError(err.message);
            console.error('Error removing from cart:', err);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            setLoading(true);
            setError(null);

            if (quantity <= 0) {
                return removeFromCart(productId);
            }

            if (isAuthenticated) {
                const data = await api.put('/api/cart/update', { productId, quantity });
                setCart(data);
                return { success: true };
            } else {
                setCart({
                    ...cart,
                    items: cart.items.map(item =>
                        item.productId === productId
                            ? { ...item, quantity }
                            : item
                    )
                });
                return { success: true };
            }
        } catch (err) {
            setError(err.message);
            console.error('Error updating quantity:', err);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            setError(null);

            if (isAuthenticated) {
                await api.delete('/api/cart');
            }
            setCart({ items: [], total: 0 });
            return { success: true };
        } catch (err) {
            setError(err.message);
            console.error('Error clearing cart:', err);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    const getCartCount = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total, item) => total + (item.quantity * (item.price || 0)), 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            error,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            fetchCart,
            getCartCount,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext); 