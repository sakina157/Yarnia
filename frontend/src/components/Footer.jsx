import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaPinterest, FaFacebook, FaPhone, FaEnvelope } from 'react-icons/fa';
import './styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src="/yarn-logo.png" alt="Yarnia Logo" className="footer-logo-img" />
            <span className="footer-logo-text">Yarnia</span>
          </div>
          <p className="footer-description">
            Handcrafted crochet treasures made with love and care. Each piece tells a unique story.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul className="footer-links">
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <p>
              <FaPhone className="contact-icon" />
              <a href="tel:+917405707753">+91 7405707753</a>
            </p>
            <p>
              <FaEnvelope className="contact-icon" />
              <a href="mailto:morawalasakina932@gmail.com">morawalasakina932@gmail.com</a>
            </p>
          </div>
          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="social-icon" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                <FaPinterest className="social-icon" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Yarnia. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 