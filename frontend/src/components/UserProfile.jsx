import React, { useState, useEffect } from 'react'; // Add useEffect
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaCamera, FaLock, FaTrash } from 'react-icons/fa';
import './styles/UserProfile.css';


const UserProfile = () => {
    const { user, isAuthenticated, loading, error, updateUserProfile, changePassword, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            navigate('/login');
            return;
        }
        
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [isAuthenticated, loading, navigate, user]);

    // If not authenticated, don't render anything (will redirect)
    if (!isAuthenticated) return null;

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await updateUserProfile(profileData);
            if (updatedUser) {
                setIsEditing(false);
                alert('Profile updated successfully');
            }
        } catch (err) {
            alert(err.message || 'Failed to update profile');
            console.error('Failed to update profile:', err);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const result = await changePassword(
                passwordData.currentPassword, 
                passwordData.newPassword
            );
            if (result) {
                setPasswordData({ 
                    currentPassword: '', 
                    newPassword: '', 
                    confirmPassword: '' 
                });
                alert('Password updated successfully');
            }
        } catch (err) {
            alert(err.message || 'Failed to change password');
            console.error('Failed to change password:', err);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );
        if (confirmed) {
            try {
                await deleteAccount();
                // Redirect will happen automatically due to logout in deleteAccount
            } catch (err) {
                console.error('Failed to delete account:', err);
            }
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <button 
                    className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <FaUser /> Profile
                </button>
                <button 
                    className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    <FaLock /> Security
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'profile' && (
                    <div className="profile-section">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                <FaUser className="avatar-placeholder" />
                                <button className="upload-button">
                                    <FaCamera />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        name: e.target.value
                                    })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        email: e.target.value
                                    })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        phone: e.target.value
                                    })}
                                    disabled={!isEditing}
                                />
                            </div>
                            {isEditing ? (
                                <div className="button-group">
                                    <button type="submit" className="save-button">
                                        Save Changes
                                    </button>
                                    <button 
                                        type="button" 
                                        className="cancel-button"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    type="button" 
                                    className="edit-button"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </form>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="security-section">
                        <h3>Change Password</h3>
                        <form onSubmit={handlePasswordChange}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value
                                    })}
                                />
                            </div>
                            <button type="submit" className="change-password-button">
                                Change Password
                            </button>
                        </form>

                        <div className="danger-zone">
                            <h3>Danger Zone</h3>
                            <button 
                                className="delete-account-button"
                                onClick={handleDeleteAccount}
                            >
                                <FaTrash /> Delete Account
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile; 