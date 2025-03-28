import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';
import { Login } from './Login';
import UserMenu from './UserMenu';
import { useAuth } from '../context/AuthContext';
import './styles/Navbar.css';

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <img src="/yarn-logo.png" alt="Yarnia Logo" className="logo-img" />
            <span className="logo-text">Yarnia</span>
          </Link>
        </div>
        
        <div className="navbar-center">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
        </div>
        
        <div className="navbar-right">
          <button className="icon-button">
            <FaSearch className="nav-icon" />
          </button>
          <div className="user-icon-container">
            <button className="icon-button" onClick={handleUserIconClick}>
              <FaUser className="nav-icon" />
            </button>
            {isAuthenticated && isUserMenuOpen && (
              <UserMenu onClose={() => setIsUserMenuOpen(false)} />
            )}
          </div>
          <button className="icon-button">
            <FaShoppingCart className="nav-icon" />
            <span className="cart-count">0</span>
          </button>
        </div>
      </nav>

      {!isAuthenticated && (
        <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      )}
    </>
  );
};

export default Navbar; 
