import React from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus, FaImage } from 'react-icons/fa';
import './styles/Cart.css';
import { getImageUrl } from '../utils/imageUtils';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, loading } = useCart();

    const handleQuantityUpdate = async (productId, newQuantity) => {
        try {
            if (loading) return;
            
            const result = await updateQuantity(productId, newQuantity);
            if (!result.success) {
                console.error('Failed to update quantity:', result.message);
            }
        } catch (error) {
            console.error('Error in handleQuantityUpdate:', error);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            if (loading) return;
            
            const result = await removeFromCart(productId);
            if (!result.success) {
                console.error('Failed to remove item:', result.message);
            }
        } catch (error) {
            console.error('Error in handleRemoveItem:', error);
        }
    };

    if (!cart?.items?.length) {
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
                        <div key={item.product?._id || item.productId} className="cart-item">
                            {item.product?.images?.[0] ? (
                                <img 
                                    src={getImageUrl(item.product.images[0])} 
                                    alt={item.product?.title || 'Product'}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder.png';
                                    }}
                                />
                            ) : (
                                <div className="placeholder-image">
                                    <FaImage />
                                </div>
                            )}
                            <div className="item-details">
                                <h3>{item.product?.title || 'Product'}</h3>
                                <p className="item-price">₹{item.price || item.product?.price || 0}</p>
                            </div>
                            <div className="quantity-controls">
                                <button 
                                    onClick={() => handleQuantityUpdate(item.product?._id || item.productId, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || loading}
                                    className="quantity-btn"
                                >
                                    <FaMinus />
                                </button>
                                <span>{item.quantity}</span>
                                <button 
                                    onClick={() => handleQuantityUpdate(item.product?._id || item.productId, item.quantity + 1)}
                                    disabled={loading}
                                    className="quantity-btn"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <p className="item-total">₹{(item.price || item.product?.price || 0) * item.quantity}</p>
                            <button 
                                className="remove-item"
                                onClick={() => handleRemoveItem(item.product?._id || item.productId)}
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
                        <span>₹{cart.total || 0}</span>
                    </div>
                    <button className="checkout-btn">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
