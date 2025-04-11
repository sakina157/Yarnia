import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FaShoppingBag, FaCreditCard, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUtils';
import './styles/Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [razorpayOrderId, setRazorpayOrderId] = useState(null);
    const [razorpayKeyId, setRazorpayKeyId] = useState(null);
    const [orderComplete, setOrderComplete] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        if (!cart?.items?.length) {
            navigate('/cart');
            return;
        }

        // Pre-fill user data if available
        if (user) {
            setShippingAddress(prev => ({
                ...prev,
                fullName: user.name || '',
                phone: user.phone || ''
            }));
        }
    }, [isAuthenticated, cart, navigate, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateShippingForm = () => {
        const { fullName, address, city, state, postalCode, phone } = shippingAddress;
        return fullName && address && city && state && postalCode && phone;
    };

    const handleNext = () => {
        if (activeStep === 0 && !validateShippingForm()) {
            return;
        }
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            
            // Create order
            const response = await api.post('/api/orders', { shippingAddress });
            
            if (!response.success || !response.order || !response.razorpayOrderId || !response.razorpayKeyId) {
                throw new Error('Invalid response from server');
            }

            setOrderId(response.order._id);
            
            // Initialize Razorpay payment
            const options = {
                key: response.razorpayKeyId,
                amount: response.amount,
                currency: response.currency,
                name: 'Yarnia',
                description: 'Order Payment',
                order_id: response.razorpayOrderId,
                image: '/image/logo.png',
                prefill: {
                    name: shippingAddress.fullName,
                    email: user?.email || '',
                    contact: shippingAddress.phone
                },
                notes: {
                    shipping_address: shippingAddress.address,
                    order_id: response.order._id
                },
                theme: {
                    color: '#ffe6f0',
                },
                handler: function(paymentResponse) {
                    handlePaymentSuccess(response.order._id, paymentResponse);
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                        handlePaymentFailure('Payment cancelled by user');
                    },
                    confirm_close: true,
                    escape: false
                },
                retry: {
                    enabled: false
                }
            };

            const paymentObject = new window.Razorpay(options);
            
            paymentObject.on('payment.failed', function(failureResponse) {
                handlePaymentFailure(failureResponse.error.description);
            });

            paymentObject.on('payment.error', function(errorResponse) {
                handlePaymentFailure(errorResponse.error.description);
            });
            
            paymentObject.open();
        } catch (error) {
            console.error('Error placing order:', error);
            alert(error.response?.data?.message || 'Error placing order. Please try again.');
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (orderId, paymentResponse) => {
        try {
            await api.post(`/api/orders/${orderId}/pay`, {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature
            });
            
            await clearCart();
            setOrderComplete(true);
        } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Payment verification failed. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentFailure = (errorMessage) => {
        console.error('Payment failed:', errorMessage);
        alert(`Payment failed: ${errorMessage}`);
        setLoading(false);
    };

    const steps = [
        {
            title: 'Shipping',
            icon: <FaTruck />
        },
        {
            title: 'Payment',
            icon: <FaCreditCard />
        },
        {
            title: 'Review',
            icon: <FaCheckCircle />
        }
    ];

    if (orderComplete) {
        return (
            <div className="order-complete">
                <div className="order-complete-content">
                    <FaCheckCircle className="success-icon" />
                    <h2>Order Placed Successfully!</h2>
                    <p>Thank you for your purchase. Your order has been received and is being processed.</p>
                    <p>Order ID: {orderId}</p>
                    <button 
                        className="continue-shopping-btn"
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            
            <div className="checkout-steps">
                {steps.map((step, index) => (
                    <div 
                        key={index} 
                        className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
                    >
                        <div className="step-icon">{step.icon}</div>
                        <div className="step-title">{step.title}</div>
                        {index < steps.length - 1 && <div className="step-connector"></div>}
                    </div>
                ))}
            </div>
            
            <div className="checkout-container">
                <div className="checkout-form">
                    {activeStep === 0 && (
                        <div className="shipping-form">
                            <h2>Shipping Information</h2>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={shippingAddress.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={shippingAddress.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={shippingAddress.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={shippingAddress.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        value={shippingAddress.postalCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={shippingAddress.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeStep === 1 && (
                        <div className="payment-method">
                            <h2>Payment Method</h2>
                            <div className="payment-options">
                                <div className="payment-option selected">
                                    <FaCreditCard />
                                    <span>Razorpay</span>
                                </div>
                            </div>
                            <div className="payment-info">
                                <p>You will be redirected to Razorpay's secure payment gateway to complete your purchase.</p>
                                <p>We accept all major credit/debit cards, UPI, and net banking.</p>
                            </div>
                        </div>
                    )}
                    
                    {activeStep === 2 && (
                        <div className="order-review">
                            <h2>Order Review</h2>
                            <div className="review-section">
                                <h3>Shipping Address</h3>
                                <div className="address-details">
                                    <p>{shippingAddress.fullName}</p>
                                    <p>{shippingAddress.address}</p>
                                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                                    <p>{shippingAddress.country}</p>
                                    <p>Phone: {shippingAddress.phone}</p>
                                </div>
                            </div>
                            
                            <div className="review-section">
                                <h3>Order Items</h3>
                                <div className="order-items">
                                    {cart.items.map(item => (
                                        <div key={item.product?._id || item.productId} className="order-item">
                                            <div className="item-image">
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
                                                        <FaShoppingBag />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="item-details">
                                                <h4>{item.product?.title || 'Product'}</h4>
                                                <p>Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="item-price">
                                                ₹{(item.price || item.product?.price || 0) * item.quantity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="checkout-actions">
                        {activeStep > 0 && (
                            <button 
                                className="back-btn"
                                onClick={handleBack}
                                disabled={loading}
                            >
                                Back
                            </button>
                        )}
                        
                        {activeStep < steps.length - 1 ? (
                            <button 
                                className="next-btn"
                                onClick={handleNext}
                                disabled={loading || (activeStep === 0 && !validateShippingForm())}
                            >
                                Next
                            </button>
                        ) : (
                            <button 
                                className="place-order-btn"
                                onClick={handlePlaceOrder}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-items">
                        {cart.items.map(item => (
                            <div key={item.product?._id || item.productId} className="summary-item">
                                <div className="item-info">
                                    <span className="item-name">{item.product?.title || 'Product'}</span>
                                    <span className="item-quantity">x {item.quantity}</span>
                                </div>
                                <span className="item-price">₹{(item.price || item.product?.price || 0) * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cart.total || 0}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>₹100</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (18%)</span>
                            <span>₹{Math.round((cart.total || 0) * 0.18)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{(cart.total || 0) + 100 + Math.round((cart.total || 0) * 0.18)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 