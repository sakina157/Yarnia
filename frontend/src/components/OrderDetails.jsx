import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { api } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';
import './styles/OrderDetails.css';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/orders/${orderId}`);
                setOrder(response.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, isAuthenticated, navigate]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaSpinner className="status-icon pending" />;
            case 'processing':
                return <FaBox className="status-icon processing" />;
            case 'shipped':
                return <FaTruck className="status-icon shipped" />;
            case 'delivered':
                return <FaCheckCircle className="status-icon delivered" />;
            case 'cancelled':
                return <FaTimesCircle className="status-icon cancelled" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FaSpinner className="loading-spinner" />
                <p>Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={() => navigate('/orders')}>
                    Back to Orders
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="error-container">
                <p>Order not found</p>
                <button onClick={() => navigate('/orders')}>
                    Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="order-details-page">
            <button className="back-button" onClick={() => navigate('/orders')}>
                <FaArrowLeft /> Back to Orders
            </button>

            <div className="order-details-container">
                <div className="order-header">
                    <div className="order-info">
                        <h2>Order #{order._id.slice(-6)}</h2>
                        <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="order-status">
                        {getStatusIcon(order.status)}
                        <span className={`status-text ${order.status}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </div>
                </div>

                <div className="order-sections">
                    <section className="shipping-info">
                        <h3>Shipping Information</h3>
                        <div className="info-card">
                            <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
                            <p><strong>Address:</strong> {order.shippingAddress.address}</p>
                            <p><strong>City:</strong> {order.shippingAddress.city}</p>
                            <p><strong>State:</strong> {order.shippingAddress.state}</p>
                            <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
                            <p><strong>Country:</strong> {order.shippingAddress.country}</p>
                        </div>
                    </section>

                    <section className="payment-info">
                        <h3>Payment Information</h3>
                        <div className="info-card">
                            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                            <p><strong>Transaction ID:</strong> {order.paymentResult?.id || 'N/A'}</p>
                            <p><strong>Payment Date:</strong> {order.paymentResult?.date ? formatDate(order.paymentResult.date) : 'N/A'}</p>
                        </div>
                    </section>

                    <section className="order-items">
                        <h3>Order Items</h3>
                        <div className="items-list">
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <div className="item-image">
                                        {item.product?.images?.[0] ? (
                                            <img 
                                                src={getImageUrl(item.product.images[0])} 
                                                alt={item.product.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder.png';
                                                }}
                                            />
                                        ) : (
                                            <div className="placeholder-image">
                                                <FaBox />
                                            </div>
                                        )}
                                    </div>
                                    <div className="item-details">
                                        <h4>{item.product?.title || 'Product Unavailable'}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="item-price">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-card">
                            <div className="summary-row">
                                <span>Items Total:</span>
                                <span>${order.itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span>${order.shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax:</span>
                                <span>${order.taxPrice.toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </section>

                    {order.trackingNumber && (
                        <section className="tracking-info">
                            <h3>Tracking Information</h3>
                            <div className="info-card">
                                <p>Tracking Number: <span>{order.trackingNumber}</span></p>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails; 