import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './styles/CartDropdown.css';

const CartDropdown = ({ onClose }) => {
    const { cart, removeFromCart } = useCart();
    const navigate = useNavigate();

    const handleViewCart = () => {
        navigate('/cart');
        onClose();
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
                {cart?.items.length > 0 ? (
                    cart.items.map(item => (
                        <div key={item.product._id} className="cart-item">
                            <img 
                                src={item.product.images[0]} 
                                alt={item.product.title} 
                            />
                            <div className="item-details">
                                <h4>{item.product.title}</h4>
                                <p>₹{item.price} × {item.quantity}</p>
                            </div>
                            <button 
                                className="remove-btn"
                                onClick={() => removeFromCart(item.product._id)}
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

            {cart?.items.length > 0 && (
                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Total:</span>
                        <span>₹{cart.total}</span>
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