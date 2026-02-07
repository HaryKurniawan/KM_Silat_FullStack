
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, BookOpen, LogOut, Menu, X, Calendar } from 'lucide-react';
import { useState } from 'react';

export const DashboardLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { path: '/dashboard/anggota', label: 'Anggota', icon: <Users size={20} /> },
        { path: '/dashboard/roadmaps', label: 'Materi (Roadmap)', icon: <BookOpen size={20} /> },
        { path: '/dashboard/jadwal', label: 'Kelola Jadwal', icon: <Calendar size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarOpen ? '250px' : '0',
                transition: 'width 0.3s',
                background: 'var(--bg-secondary)',
                borderRight: '1px solid var(--border-color)',
                overflow: 'hidden',
                position: 'fixed',
                height: '100vh',
                zIndex: 50
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ color: '#fbbf24', margin: 0, fontWeight: 'bold', fontSize: '1.25rem' }}>Admin Panel</h2>
                    <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'md:none' }}>
                        <X size={24} />
                    </button>
                </div>

                <nav style={{ padding: '1rem' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.75rem 1rem',
                                marginBottom: '0.5rem',
                                borderRadius: 'var(--border-radius)',
                                color: location.pathname === item.path ? '#111827' : 'var(--text-secondary)',
                                background: location.pathname === item.path ? '#fbbf24' : 'transparent',
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                fontWeight: location.pathname === item.path ? '600' : '400'
                            }}
                        >
                            <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '0.75rem 1rem',
                            marginTop: '2rem',
                            borderRadius: 'var(--border-radius)',
                            color: '#ef4444',
                            background: 'transparent',
                            border: '1px solid #ef4444',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={20} style={{ marginRight: '0.75rem' }} />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: sidebarOpen ? '250px' : '0',
                transition: 'margin-left 0.3s',
                padding: '2rem',
                width: '100%',
                background: 'var(--bg-primary)'
            }}>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        position: 'fixed',
                        top: '1rem',
                        left: sidebarOpen ? '260px' : '1rem',
                        zIndex: 40,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'left 0.3s'
                    }}
                >
                    <Menu size={20} />
                </button>

                <div style={{ maxWidth: '1200px', margin: '0 auto', marginTop: '1rem' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
