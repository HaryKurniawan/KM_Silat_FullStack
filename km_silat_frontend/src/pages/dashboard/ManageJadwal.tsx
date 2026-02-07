import { useState, useEffect } from 'react';
import { Calendar, Save, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { jadwalService } from '../../services/api';
import './ManageJadwal.css';

export const ManageJadwal = () => {
    const [jadwal, setJadwal] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchJadwal = async () => {
        setLoading(true);
        try {
            const response = await jadwalService.getAll();
            setJadwal(response.data);
        } catch (error) {
            console.error('Failed to fetch jadwal', error);
            setMessage({ type: 'error', text: 'Gagal mengambil data jadwal' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJadwal();
    }, []);

    const handleUpdate = async (id: number, data: any) => {
        setSaving(id);
        setMessage(null);
        try {
            await jadwalService.update(id, data);
            setMessage({ type: 'success', text: `Jadwal ${data.hari} berhasil diperbarui` });
            fetchJadwal();
        } catch (error) {
            console.error('Failed to update jadwal', error);
            setMessage({ type: 'error', text: 'Gagal memperbarui jadwal' });
        } finally {
            setSaving(null);
        }
    };

    const handleInputChange = (id: number, field: string, value: string) => {
        setJadwal(jadwal.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    if (loading && jadwal.length === 0) {
        return <div className="p-8 text-center text-gray-400">Memuat jadwal...</div>;
    }

    return (
        <div className="manage-jadwal-container">
            {/* Header section */}
            <header className="manage-header">
                <div className="header-glow"></div>
                <div className="header-content">
                    <div className="header-title-row">
                        <div className="header-icon-wrapper">
                            <Calendar size={24} />
                        </div>
                        <h1 className="header-title">
                            Kelola <span className="text-highlight">Jadwal Latihan</span>
                        </h1>
                    </div>
                    <p className="header-subtitle">
                        Personalisasi jadwal mingguan UKM Silat. Perubahan yang Anda simpan akan langsung tampil secara dinamis pada halaman utama.
                    </p>
                </div>
                <button
                    onClick={fetchJadwal}
                    disabled={loading}
                    className={`refresh-btn ${loading ? 'loading' : ''}`}
                    title="Refresh Data"
                >
                    <RefreshCw size={20} />
                    <span>Muat Ulang</span>
                </button>
            </header>

            {/* Notification Toast */}
            {message && (
                <div className={`notification-toast ${message.type === 'success' ? 'toast-success' : 'toast-error'}`}>
                    <div className="toast-icon">
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    </div>
                    <span>{message.text}</span>
                </div>
            )}

            {/* Schedule Cards Grid */}
            <div className="schedule-grid">
                {jadwal.map((item, index) => (
                    <div key={item.id} className="schedule-card">
                        {/* Day Identifier Strip */}
                        <div className={`card-accent-strip ${item.status === 'Latihan' ? 'card-accent-active' : 'card-accent-inactive'}`}></div>

                        {/* Card Top: Title & Status */}
                        <div className="card-header">
                            <div className="card-title-group">
                                <div className="day-number">0{index + 1}</div>
                                <div>
                                    <h3 className="day-name">{item.hari}</h3>
                                    <div className="status-indicator">
                                        <span className={`status-dot ${item.status === 'Latihan' ? 'active' : 'inactive'}`}></span>
                                        <span className="status-text">{item.status}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleUpdate(item.id, item)}
                                disabled={saving === item.id}
                                className="save-btn"
                            >
                                {saving === item.id ? (
                                    <RefreshCw size={18} className="animate-spin" />
                                ) : (
                                    <Save size={18} />
                                )}
                                <span>Update {item.hari}</span>
                            </button>
                        </div>

                        {/* Card Body: Form Grid */}
                        <div className="card-body">
                            <div className="form-grid">
                                <div className="input-field-group">
                                    <label className="input-label">Status Keaktifan</label>
                                    <select
                                        value={item.status}
                                        onChange={(e) => handleInputChange(item.id, 'status', e.target.value)}
                                        className="input-control"
                                    >
                                        <option value="Latihan">AKTIF (LATIHAN)</option>
                                        <option value="Istirahat">NON-AKTIF (LIBUR)</option>
                                    </select>
                                </div>

                                <div className="input-field-group">
                                    <label className="input-label">Kategori Fokus</label>
                                    <select
                                        value={item.kategori || ''}
                                        disabled={item.status === 'Istirahat'}
                                        onChange={(e) => handleInputChange(item.id, 'kategori', e.target.value)}
                                        className="input-control"
                                    >
                                        <option value="">- TIDAK ADA -</option>
                                        <option value="Fisik">PENGUATAN FISIK</option>
                                        <option value="Materi">TEKNIK & SENI</option>
                                        <option value="Tanding">TAKTIK TANDING</option>
                                    </select>
                                </div>

                                <div className="input-field-group">
                                    <label className="input-label">Waktu Latihan</label>
                                    <input
                                        type="text"
                                        value={item.waktu || ''}
                                        disabled={item.status === 'Istirahat'}
                                        onChange={(e) => handleInputChange(item.id, 'waktu', e.target.value)}
                                        placeholder="HH.MM - HH.MM"
                                        className="input-control text-input"
                                    />
                                </div>

                                <div className="input-field-group">
                                    <label className="input-label">Lokasi Latihan</label>
                                    <input
                                        type="text"
                                        value={item.lokasi || ''}
                                        disabled={item.status === 'Istirahat'}
                                        onChange={(e) => handleInputChange(item.id, 'lokasi', e.target.value)}
                                        placeholder="Nama Lokasi..."
                                        className="input-control text-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
