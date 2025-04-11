import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaShoppingBag, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';
import './styles/OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/api/orders/user/orders');
            setOrders(response);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#ffd700';
            case 'processing':
                return '#1e90ff';
            case 'shipped':
                return '#32cd32';
            case 'delivered':
                return '#008000';
            case 'cancelled':
                return '#ff0000';
            default:
                return '#666';
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FaSpinner className="loading-spinner" />
                <p>Loading your orders...</p>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="no-orders">
                <FaShoppingBag className="no-orders-icon" />
                <h2>No Orders Yet</h2>
                <p>You haven't placed any orders yet.</p>
                <button onClick={() => navigate('/shop')}>Start Shopping</button>
            </div>
        );
    }

    return (
        <div className="order-history-page">
            <h1>My Orders</h1>
            <div className="orders-container">
                {orders.map(order => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <div className="order-info">
                                <h3>Order #{order._id.slice(-8)}</h3>
                                <p className="order-date">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                                {order.status}
                            </div>
                        </div>
                        
                        <div className="order-items">
                            {order.items.map(item => (
                                <div key={item.product._id} className="order-item">
                                    <div className="item-image">
                                        {item.product.images?.[0] ? (
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
                                                <FaShoppingBag />
                                            </div>
                                        )}
                                    </div>
                                    <div className="item-details">
                                        <h4>{item.product.title}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                        <p className="item-price">₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="order-footer">
                            <div className="order-total">
                                <span>Total:</span>
                                <span className="total-amount">₹{order.totalPrice}</span>
                            </div>
                            {order.trackingNumber && (
                                <div className="tracking-info">
                                    <span>Tracking Number:</span>
                                    <span>{order.trackingNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory; 