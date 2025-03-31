import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SearchResultItem = ({ product, onClose }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.info('Please login to add items to cart');
            return;
        }

        const result = await addToCart(product._id, 1);
        if (result.success) {
            toast.success('Added to cart');
        }
    };

    const handleClick = () => {
        navigate(`/product/${product._id}`);
        onClose();
    };

    return (
        <div className="search-result-item" onClick={handleClick}>
            <div className="result-image">
                <img 
                    src={product.images[0]} 
                    alt={product.title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.png'; // Add a placeholder image
                    }}
                />
            </div>
            <div className="result-details">
                <h4>{product.title}</h4>
                <p className="result-category">{product.category}</p>
                <p className="result-price">₹{product.price}</p>
            </div>
            <button 
                className="add-to-cart-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(e);
                }}
                aria-label="Add to cart"
            >
                <FaShoppingCart />
            </button>
        </div>
    );
};

export default SearchResultItem; 