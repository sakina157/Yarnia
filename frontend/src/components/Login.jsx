import React, { useState } from 'react';
import { FaTimes, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Signup } from './Signup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './styles/Auth.css';

export const Login = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        const response = await api.post('/api/auth/login', formData);
        
        if (response.success) {
            login(response.user, response.token);
            // Check if user is admin
            if (response.user.email === process.env.REACT_APP_ADMIN_EMAIL) {
                navigate('/admin');
            } else if (isStandalone) {
                navigate('/');
            } else {
                onClose();
            }
        } else {
            alert(response.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(error.response?.data?.message || 'Error logging in. Please try again.');
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
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
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