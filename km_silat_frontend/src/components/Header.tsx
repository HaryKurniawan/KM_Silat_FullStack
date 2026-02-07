import { useState, useEffect } from 'react';
import { User, LogOut, LogIn, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';
import logo from '../assets/logo.png';

export const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (isDropdownOpen) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    const handleLoginClick = () => {
        setIsDropdownOpen(false);
        navigate('/login');
    };

    const handleDashboardClick = () => {
        setIsDropdownOpen(false);
        navigate('/dashboard');
    };

    // Check if user is admin
    const isAdmin = user?.role?.toLowerCase() === 'admin';

    return (
        <header className="app-header">
            <div className="header-content">
                {/* Logo Section */}
                <div className="header-logo">
                    <img src={logo} alt="Logo" className="logo-image" />
                    <span className="logo-text">UKM Pencak Silat</span>
                </div>

                {/* User Menu Section - Always show */}
                <div className="header-user">
                    <button 
                        className="user-menu-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(!isDropdownOpen);
                        }}
                    >
                        {/* Show username only if logged in */}
                        {isAuthenticated && user && (
                            <span className="user-name">{user.username}</span>
                        )}
                        <div className="user-icon">
                            <User size={20} />
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <>
                            <div 
                                className="dropdown-overlay"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDropdownOpen(false);
                                }}
                            />
                            <div className="user-dropdown">
                                {isAuthenticated && user ? (
                                    // Logged in - Show user info, dashboard (if admin), and logout
                                    <>
                                        <div className="dropdown-user-info">
                                            <p className="dropdown-username">{user.username}</p>
                                            <p className="dropdown-role">{user.role}</p>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        
                                        {/* Dashboard Menu - Only show for Admin */}
                                        {isAdmin && (
                                            <button 
                                                className="dropdown-item dropdown-item-dashboard"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDashboardClick();
                                                }}
                                            >
                                                <LayoutDashboard size={18} />
                                                <span>Dashboard Admin</span>
                                            </button>
                                        )}
                                        
                                        <button 
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLogout();
                                            }}
                                        >
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    // Not logged in - Show login button
                                    <>
                                        <div className="dropdown-user-info">
                                            <p className="dropdown-username">Guest</p>
                                            <p className="dropdown-role">Belum Login</p>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <button 
                                            className="dropdown-item dropdown-item-login"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLoginClick();
                                            }}
                                        >
                                            <LogIn size={18} />
                                            <span>Login</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};