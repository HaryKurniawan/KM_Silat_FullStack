import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import './Login.css';
import logo from '../assets/logo.png';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ username, password }); 
            // Redirect ke landing page setelah login berhasil
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login gagal. Periksa username dan password Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background-glow"></div>
            
            <div className="login-card">
                <div className="login-header">
                    <img src={logo} alt="Logo" className="login-logo" />
                    <h1 className="login-title">UKM Pencak Silat</h1>
                    <p className="login-subtitle">Masuk sebagai Anggota</p>
                </div>

                {error && (
                    <div className="login-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            disabled={loading}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="spin" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>Masuk</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <button 
                        type="button"
                        className="back-button"
                        onClick={() => navigate('/')}
                    >
                        ← Kembali ke Beranda
                    </button>
                </div>
            </div>
        </div>
    );
};