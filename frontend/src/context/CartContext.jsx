import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useAuth();

    // Fetch cart on auth change
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCart(data);
        } catch (error) {
            setError('Error fetching cart');
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            return { success: false, message: 'Please login to add items to cart' };
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, quantity })
            });

            const data = await response.json();
            
            if (response.ok) {
                setCart(data);
                return { success: true, message: 'Item added to cart!' };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Error adding item to cart' };
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (newQuantity < 1) {
                toast.error('Quantity cannot be less than 1');
                return { success: false };
            }

            // First check stock
            const response = await fetch(`/api/cart/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, quantity: newQuantity })
            });

            const data = await response.json();
            if (response.ok) {
                setCart(data);
                toast.success('Cart updated successfully');
                return { success: true };
            } else {
                toast.error(data.message || 'Error updating cart');
                return { success: false };
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Error updating quantity');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/cart/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setCart(data);
                return { success: true, message: 'Item removed from cart' };
            }
        } catch (error) {
            return { success: false, message: 'Error removing item from cart' };
        } finally {
            setLoading(false);
        }
    };

    const getCartCount = () => {
        if (!cart) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        if (!cart) return 0;
        return cart.total;
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            error,
            addToCart,
            updateQuantity,
            removeFromCart,
            getCartCount,
            getCartTotal,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext); 