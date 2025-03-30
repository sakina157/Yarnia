import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';
import { Login } from './Login';
import UserMenu from './UserMenu';
import CartDropdown from './CartDropdown';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isAdmin = user?.email === process.env.REACT_APP_ADMIN_EMAIL;
  const cartCount = getCartCount();

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
          {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
        </div>
        
        <div className="navbar-right">
          <button className="icon-button">
            <FaSearch className="nav-icon" />
          </button>
          <div className="user-icon-container">
            <button 
              className="icon-button" 
              onClick={() => isAuthenticated ? setIsUserMenuOpen(!isUserMenuOpen) : setIsLoginOpen(true)}
            >
              <FaUser className="nav-icon" />
            </button>
            {isAuthenticated && isUserMenuOpen && (
              <UserMenu onClose={() => setIsUserMenuOpen(false)} />
            )}
          </div>
          <div className="cart-icon-container">
            <button 
              className="icon-button"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <FaShoppingCart className="nav-icon" />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
            {isCartOpen && <CartDropdown onClose={() => setIsCartOpen(false)} />}
          </div>
        </div>
      </nav>

      {!isAuthenticated && (
        <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      )}
    </>
  );
};

export default Navbar; 
