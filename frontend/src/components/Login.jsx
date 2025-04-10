import React, { useState } from 'react';
import { FaTimes, FaEnvelope, FaLock } from 'react-icons/fa';
import { Signup } from './Signup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './styles/Auth.css';

export const Login = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const isStandalone = location.pathname === '/login';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const data = await api.post('/api/auth/login', formData);
        
        if (data.user && data.token) {
            login(data.user, data.token);
            // Check if user is admin
            if (data.user.email === process.env.REACT_APP_ADMIN_EMAIL) {
                navigate('/admin');
            } else if (isStandalone) {
                navigate('/');
            } else {
                onClose();
            }
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Error logging in. Please try again.');
    }

    console.log('Login form submitted:', formData);
  };

  const handleClose = () => {
    if (isStandalone) {
      navigate(-1);
    } else {
      onClose();
    }
  };

  const handleSignupClick = () => {
    if (isStandalone) {
      navigate('/signup');
    } else {
      setShowSignup(true);
    }
  };

  if (!isOpen && !isStandalone) return null;
  if (showSignup && !isStandalone) return <Signup isOpen={true} onClose={onClose} onBackToLogin={() => setShowSignup(false)} />;

  const content = (
    <div className="auth-modal">
      <button className="close-button" onClick={handleClose}>
        <FaTimes />
      </button>
      
      <div className="auth-header">
        <h2>Welcome Back!</h2>
        <p>Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <div className="input-icon">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-icon">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>

        <button type="submit" className="submit-button">
          Sign In
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?
          <button className="toggle-button" onClick={handleSignupClick}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );

  return isStandalone ? (
    <div className="auth-standalone-page">
      {content}
    </div>
  ) : (
    <div className="auth-modal-overlay">
      {content}
    </div>
  );
}; 