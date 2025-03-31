import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaInstagram, FaEnvelope, FaWhatsapp, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './styles/ProductDetail.css';
import ReviewSection from './ReviewSection';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Contact information (you can move these to environment variables)
    const contactInfo = {
        instagram: "https://instagram.com/yarnia._",
        email: "morawalasakina932@gmail.com",
        whatsapp: "7405707753"
    };

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const response = await fetch(`/api/products/${id}`);
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            toast.error('Error loading product details');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.info('Please login to add items to cart');
            return;
        }

        const result = await addToCart(product._id, 1);
        if (result.success) {
            toast.success('Added to cart');
        }
    };

    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!product.images.length) return;
        
        const touchDiff = touchStart - touchEnd;
        
        if (Math.abs(touchDiff) > 50) { // minimum swipe distance
            if (touchDiff > 0) {
                // Swipe left
                setCurrentImageIndex(prev => 
                    prev === product.images.length - 1 ? 0 : prev + 1
                );
            } else {
                // Swipe right
                setCurrentImageIndex(prev => 
                    prev === 0 ? product.images.length - 1 : prev - 1
                );
            }
        }
        
        setTouchStart(0);
        setTouchEnd(0);
    };

    const [relatedProducts, setRelatedProducts] = useState([]);

    const fetchRelatedProducts = async () => {
        try {
            const response = await fetch(`/api/products/related-products?category=${product.category}&exclude=${product._id}`);
            const data = await response.json();
            setRelatedProducts(data);
        } catch (error) {
            console.error('Error fetching related products:', error);
        }
    };

    useEffect(() => {
        if (product) {
            fetchRelatedProducts();
        }
    }, [product]);

    if (loading) {
        return (
            <div className="product-detail-loading">
                <div className="loader"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-error">
                <h2>Product not found</h2>
                <button onClick={() => navigate('/shop')}>Back to Shop</button>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            <div className="product-detail-content">
                {/* Image Gallery Section */}
                <div className="product-images">
                    <div 
                        className="main-image"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <button 
                            className="gallery-nav prev"
                            onClick={() => setCurrentImageIndex(prev => 
                                prev === 0 ? product.images.length - 1 : prev - 1
                            )}
                        >
                            <FaArrowLeft />
                        </button>
                        <img 
                            src={product.images[currentImageIndex]} 
                            alt={product.title} 
                        />
                        <button 
                            className="gallery-nav next"
                            onClick={() => setCurrentImageIndex(prev => 
                                prev === product.images.length - 1 ? 0 : prev + 1
                            )}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                    <div className="image-thumbnails">
                        {product.images.map((image, index) => (
                            <div 
                                key={index}
                                className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            >
                                <img src={image} alt={`${product.title} ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info Section */}
                <div className="product-info-detail">
                    <h1>{product.title}</h1>
                    <div className="product-category">{product.category}</div>
                    <div className="product-price">₹{product.price}</div>
                    
                    {/* Cart icon button styled like shop page */}
                    <button 
                        className="add-to-cart" 
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        aria-label="Add to cart"
                    >
                        <FaShoppingCart />
                    </button>

                    <div className="stock-status">
                        {product.stock > 0 ? (
                            <span className="in-stock">In Stock</span>
                        ) : (
                            <span className="out-of-stock">Out of Stock</span>
                        )}
                    </div>

                    <div className="product-description">
                        <h3>Product Description</h3>
                        <p>{product.description}</p>
                    </div>

                    {/* Customization Section */}
                    <div className="product-customization">
                    <h3>Customization Available</h3>
                    <p>For customization requests and more product information, please contact us:</p>
                        <div className="contact-links">
                            <a 
                                href={contactInfo.instagram} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="contact-link instagram"
                            >
                                <FaInstagram /> Instagram
                            </a>
                            <a 
                                href={`mailto:${contactInfo.email}`}
                                className="contact-link email"
                            >
                                <FaEnvelope /> Email
                            </a>
                            <a 
                                href={`https://wa.me/${contactInfo.whatsapp}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="contact-link whatsapp"
                            >
                                <FaWhatsapp /> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="related-products">
                    <h2>You May Also Like</h2>
                    <div className="related-products-grid">
                        {relatedProducts.map(relatedProduct => (
                            <div 
                                key={relatedProduct._id} 
                                className="related-product-card"
                                onClick={() => {
                                    navigate(`/product/${relatedProduct._id}`);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                <div className="related-product-image">
                                    <img 
                                        src={relatedProduct.images[0]} 
                                        alt={relatedProduct.title} 
                                    />
                                </div>
                                <div className="related-product-info">
                                    <h3>{relatedProduct.title}</h3>
                                    <p className="related-product-price">
                                        ₹{relatedProduct.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="product-reviews">
                <ReviewSection productId={product._id} />
            </div>
        </div>
    );
};

export default ProductDetail; 