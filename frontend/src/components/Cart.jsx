import React from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import './styles/Cart.css';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, loading } = useCart();

    const handleQuantityUpdate = async (productId, newQuantity) => {
        try {
            if (loading) return;
            
            const result = await updateQuantity(productId, newQuantity);
            if (!result.success) {
                console.log('Failed to update quantity');
            }
        } catch (error) {
            console.error('Error in handleQuantityUpdate:', error);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="empty-cart-page">
                <h2>Your Cart is Empty</h2>
                <p>Add some products to your cart and they will show up here</p>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {cart.items.map(item => (
                        <div key={item.product._id} className="cart-item">
                            <img 
                                src={item.product.images[0]} 
                                alt={item.product.title} 
                            />
                            <div className="item-details">
                                <h3>{item.product.title}</h3>
                                <p className="item-price">₹{item.price}</p>
                            </div>
                            <div className="quantity-controls">
                                <button 
                                    onClick={() => handleQuantityUpdate(item.product._id, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || loading}
                                    className="quantity-btn"
                                >
                                    <FaMinus />
                                </button>
                                <span>{item.quantity}</span>
                                <button 
                                    onClick={() => handleQuantityUpdate(item.product._id, item.quantity + 1)}
                                    disabled={loading}
                                    className="quantity-btn"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <p className="item-total">₹{item.price * item.quantity}</p>
                            <button 
                                className="remove-item"
                                onClick={() => removeFromCart(item.product._id)}
                                disabled={loading}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>₹{cart.total}</span>
                    </div>
                    <button className="checkout-btn">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
