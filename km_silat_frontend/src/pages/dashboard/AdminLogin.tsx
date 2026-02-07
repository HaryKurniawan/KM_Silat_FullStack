import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate('/dashboard');
        } catch (err) {
            setError('Login gagal. Periksa username dan password.');
        }
    };

    return (
        <div className="login-page" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#111827',
            color: 'white'
        }}>
            <form onSubmit={handleSubmit} style={{
                background: '#1f2937',
                padding: '2rem',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#fbbf24' }}>Login Dashboard</h2>

                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#374151', borderRadius: '4px', padding: '0.5rem' }}>
                        <User size={20} style={{ marginRight: '0.5rem', color: '#9ca3af' }} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                            placeholder="Masukan username"
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#374151', borderRadius: '4px', padding: '0.5rem' }}>
                        <Lock size={20} style={{ marginRight: '0.5rem', color: '#9ca3af' }} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                            placeholder="Masukan password"
                        />
                    </div>
                </div>

                <button type="submit" style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#fbbf24',
                    color: '#111827',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }}>
                    Masuk
                </button>
            </form>
        </div>
    );
};