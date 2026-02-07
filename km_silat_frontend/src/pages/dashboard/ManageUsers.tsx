import { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { userService } from '../../services/api';
import './ManageUsers.css';

interface User {
    id: string;
    username: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'USER',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userService.getAll();
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                password: '',
                role: user.role,
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                password: '',
                role: 'USER',
            });
        }
        setShowPassword(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ username: '', password: '', role: 'USER' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingUser) {
                // Update user
                const updateData: any = {
                    username: formData.username,
                    role: formData.role,
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await userService.update(editingUser.id, updateData);
            } else {
                // Create new user
                await userService.create(formData);
            }
            
            fetchUsers();
            handleCloseModal();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    const handleDelete = async (id: string, username: string) => {
        if (window.confirm(`Yakin ingin menghapus user "${username}"?`)) {
            try {
                await userService.delete(id);
                fetchUsers();
            } catch (error: any) {
                alert(error.response?.data?.message || 'Gagal menghapus user');
            }
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader2 className="spin" size={32} />
            </div>
        );
    }

    return (
        <div className="manage-users-container">
            <div className="page-header">
                <div>
                    <h1>Kelola Pengguna</h1>
                    <p className="page-subtitle">Manajemen akun pengguna sistem</p>
                </div>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    <UserPlus size={20} />
                    <span>Tambah User</span>
                </button>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Dibuat</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <strong>{user.username}</strong>
                                </td>
                                <td>
                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-icon"
                                            onClick={() => handleOpenModal(user)}
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="btn-icon danger"
                                            onClick={() => handleDelete(user.id, user.username)}
                                            title="Hapus"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="empty-state">
                        <p>Belum ada pengguna terdaftar</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Masukkan username"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Password {editingUser && '(kosongkan jika tidak ingin mengubah)'}
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Masukkan password"
                                        required={!editingUser}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    required
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                                    Batal
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingUser ? 'Update' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};