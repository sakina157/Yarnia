import React, { useState } from 'react';
import { FaTimes, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useLocation, Link} from 'react-router-dom';
import { api } from '../services/api';
import './styles/Auth.css';

export const Signup = ({ isOpen, onClose, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isStandalone = location.pathname === '/signup';

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
        ...formData,
        [e.target.name]: value
    });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Client-side validation
        if (!formData.phone || !formData.email || !formData.password || !formData.confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        // Phone number validation
        if (!/^\d{10}$/.test(formData.phone)) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Password validation
        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Remove confirmPassword from the data sent to the server
        const signupData = {
            phone: formData.phone,
            email: formData.email,
            password: formData.password,
            acceptedTerms: formData.acceptedTerms
        };

        const response = await api.post('/api/auth/signup', signupData);
        
        if (response.success) {
            alert('Account created successfully!');
            if (isStandalone) {
                navigate('/login');
            } else {
                onBackToLogin();
            }
        } else {
            alert(response.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        const errorMessage = error.response?.data?.message || 'Error creating account. Please try again.';
        alert(errorMessage);
    }
  };

  const handleClose = () => {
    if (isStandalone) {
      navigate(-1);
    } else {
      onClose();
    }
  };

  const handleLoginClick = () => {
    if (isStandalone) {
      navigate('/login');
    } else {
      onBackToLogin();
    }
  };

  if (!isOpen && !isStandalone) return null;

  const content = (
    <div className="auth-modal">
      <button className="close-button" onClick={handleClose}>
        <FaTimes />
      </button>
      
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Join the Yarnia community</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <div className="input-icon">
            <FaPhone className="icon" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

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

        <div className="form-group">
          <div className="input-icon">
            <FaLock className="icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        <div className="terms-checkbox">
        <label>
          <input
            type="checkbox"
            name="acceptedTerms"
            checked={formData.acceptedTerms}
            onChange={handleChange}
            required
          />
          I agree to the {' '}
          <Link to="/terms" target="_blank" className="terms-link">
            Terms and Conditions
          </Link>
        </label>
      </div>

        <button type="submit" 
        className="submit-button"
        disabled={!formData.acceptedTerms}>
          Sign Up
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?
          <button className="toggle-button" onClick={handleLoginClick}>
            Sign In
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