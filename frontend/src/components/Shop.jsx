import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaImage } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './styles/Shop.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await api.get('/api/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!isAuthenticated) {
            toast.info('Please login to add items to cart', {
                position: "top-right",
                theme: "colored"
            });
            return;
        }

        const result = await addToCart(productId, 1);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    const filteredProducts = selectedCategory === 'All' 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    return (
        <div className="shop-container">
            <div className="shop-header">
                <h1>Our Crochet Collection</h1>
                <p>Handmade with love, designed to bring joy</p>
            </div>

            <div className="filter-container">
                <button 
                    className={`filter-button ${selectedCategory === 'All' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('All')}
                >
                    All
                </button>
                {['Flowers', 'Keychain', 'Toys', 'Bags', 'Accessories'].map(category => (
                    <button
                        key={category}
                        className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="products-grid">
                {filteredProducts.map(product => (
                    <div key={product._id} className="product-card">
                        <div 
                            className="product-image-placeholder"
                            onClick={() => navigate(`/product/${product._id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            {product.images && product.images[0] ? (
                                <img 
                                    src={getImageUrl(product.images[0])} 
                                    alt={product.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder.png'; // Add a placeholder image
                                    }}
                                />
                            ) : (
                                <FaImage />
                            )}
                        </div>
                        <div className="product-info">
                            <div className="product-category">{product.category}</div>
                            <h3 
                                className="product-name"
                                onClick={() => navigate(`/product/${product._id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                {product.title}
                            </h3>
                            <div className="product-price">₹{product.price}</div>
                            <button 
                                className="add-to-cart" 
                                onClick={() => handleAddToCart(product._id)}
                                aria-label="Add to cart"
                            >
                                <FaShoppingCart />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop; 