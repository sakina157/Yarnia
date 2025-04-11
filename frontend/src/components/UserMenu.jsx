import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './styles/UserMenu.css';

const UserMenu = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = (tab) => {
    navigate('/profile', { state: { activeTab: tab } });
    onClose();
  };

  const handleClickOutside = (e) => {
    if (e.target.closest('.user-menu')) return;
    onClose();
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu">
      <div className="user-info"> 
        <div className="user-avatar">
          <FaUser className="avatar-icon" />
        </div>
        <div className="user-details">
          <div className="user-email">{user?.email || ''}</div>
          <Link to="/profile" className="user-name" onClick={onClose}>
            Set up your profile
          </Link>
        </div>
      </div>

      <div className="menu-items">
        <div className="menu-item" onClick={() => handleProfileClick('profile')}>
          <FaUser className="menu-icon" />
          My Profile
        </div>
        <Link to="/orders" className="menu-item" onClick={onClose}>
          <FaShoppingBag className="menu-icon" />
          My Orders
        </Link>
        <div className="menu-item" onClick={() => handleProfileClick('security')}>
          <FaCog className="menu-icon" />
          Settings
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="menu-icon" />
        Logout
      </button>
    </div>
  );
};

export default UserMenu;
