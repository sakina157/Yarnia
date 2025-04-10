import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaShoppingBag, FaImage } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './styles/CartDropdown.css';
import { getImageUrl } from '../utils/imageUtils';

const CartDropdown = ({ onClose }) => {
    const { cart, removeFromCart } = useCart();
    const navigate = useNavigate();

    const handleViewCart = () => {
        navigate('/cart');
        onClose();
    };

    const handleRemoveItem = async (productId) => {
        const result = await removeFromCart(productId);
        if (!result.success) {
            console.error('Failed to remove item from cart');
        }
    };

    return (
        <div className="cart-dropdown">
            <div className="cart-dropdown-header">
                <h3>Shopping Cart</h3>
                <button className="close-btn" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>
            
            <div className="cart-items">
                {cart?.items?.length > 0 ? (
                    cart.items.map(item => (
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
                                <h4>{item.product?.title || 'Product'}</h4>
                                <p>₹{item.price || item.product?.price || 0} × {item.quantity}</p>
                            </div>
                            <button 
                                className="remove-btn"
                                onClick={() => handleRemoveItem(item.product?._id || item.productId)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="empty-cart">
                        <FaShoppingBag />
                        <p>Your cart is empty</p>
                    </div>
                )}
            </div>

            {cart?.items?.length > 0 && (
                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Total:</span>
                        <span>₹{cart.total || 0}</span>
                    </div>
                    <button className="view-cart-btn" onClick={handleViewCart}>
                        View Cart
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartDropdown; 