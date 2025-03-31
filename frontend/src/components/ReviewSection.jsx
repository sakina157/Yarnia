import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './styles/ReviewSection.css';

const ReviewSection = ({ productId }) => {
    const { isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/reviews/product/${productId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setReviews(data.reviews || []);
            setAvgRating(data.avgRating || 0);
            setTotalReviews(data.total || 0);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Unable to load reviews');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info('Please login to submit a review');
            return;
        }

        if (!userRating) {
            toast.warning('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    rating: userRating,
                    review: reviewText.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error submitting review');
            }

            toast.success('Review submitted successfully');
            setUserRating(0);
            setReviewText('');
            setHoverRating(0);
            fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.message || 'Error submitting review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="reviews-section">
            <div className="reviews-header">
                <div className="rating-summary">
                    <div className="average-rating">
                        <h2>{avgRating.toFixed(1)}</h2>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar 
                                    key={star}
                                    className={`star ${star <= avgRating ? 'filled' : ''}`}
                                />
                            ))}
                        </div>
                        <p>{totalReviews} reviews</p>
                    </div>
                </div>
            </div>

            {isAuthenticated && (
                <form className="review-form" onSubmit={handleSubmitReview}>
                    <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`star ${star <= (hoverRating || userRating) ? 'filled' : ''}`}
                                onClick={() => setUserRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            />
                        ))}
                    </div>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review here..."
                        required
                        minLength={10}
                        maxLength={500}
                    />
                    <button 
                        type="submit" 
                        className="submit-review-btn"
                        disabled={isSubmitting || !userRating}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            <div className="reviews-list">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="review-card">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <h4>{review.user?.name || 'Anonymous'}</h4>
                                    <div className="review-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`star ${star <= review.rating ? 'filled' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="review-text">{review.review}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-reviews">No reviews yet. Be the first to review!</p>
                )}
            </div>
        </div>
    );
};

export default ReviewSection; 