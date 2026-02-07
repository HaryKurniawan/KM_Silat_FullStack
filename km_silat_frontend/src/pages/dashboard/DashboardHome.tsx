import { useState, useEffect } from 'react';
import { Users, BookOpen, Activity, Loader2, TrendingUp, Calendar, Award } from 'lucide-react';
import { statsService } from '../../services/api';
import './DashboardHome.css';

export const DashboardHome = () => {
    const [stats, setStats] = useState<{ totalAnggota: number; totalMateri: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await statsService.getStats();
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getCurrentGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 18) return 'Selamat Siang';
        return 'Selamat Malam';
    };

    return (
        <div className="dashboard-home">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="greeting-section">
                    <h1 className="dashboard-title">{getCurrentGreeting()}, Admin</h1>
                    <p className="dashboard-subtitle">Berikut adalah ringkasan data UKM Pencak Silat hari ini</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {/* Card 1 - Total Anggota */}
                <div className="stat-card">
                    <div className="stat-card-content">
                        <div className="stat-info">
                            <p className="stat-label">Total Anggota</p>
                            <h3 className="stat-value">
                                {loading ? (
                                    <Loader2 className="spinner" size={32} />
                                ) : (
                                    stats?.totalAnggota ?? 0
                                )}
                            </h3>
                            <div className="stat-trend">
                                <TrendingUp size={16} />
                                <span>Anggota terdaftar</span>
                            </div>
                        </div>
                        <div className="stat-icon-wrapper stat-icon-primary">
                            <Users size={28} />
                        </div>
                    </div>
                </div>

                {/* Card 2 - Materi Aktif */}
                <div className="stat-card">
                    <div className="stat-card-content">
                        <div className="stat-info">
                            <p className="stat-label">Materi Aktif</p>
                            <h3 className="stat-value">
                                {loading ? (
                                    <Loader2 className="spinner" size={32} />
                                ) : (
                                    stats?.totalMateri ?? 0
                                )}
                            </h3>
                            <div className="stat-trend">
                                <TrendingUp size={16} />
                                <span>Roadmap tersedia</span>
                            </div>
                        </div>
                        <div className="stat-icon-wrapper stat-icon-secondary">
                            <BookOpen size={28} />
                        </div>
                    </div>
                </div>

                {/* Card 3 - Jadwal (Coming Soon) */}
                <div className="stat-card stat-card-disabled">
                    <div className="stat-card-content">
                        <div className="stat-info">
                            <p className="stat-label">Jadwal Latihan</p>
                            <h3 className="stat-value">-</h3>
                            <div className="stat-trend stat-trend-muted">
                                <Calendar size={16} />
                                <span>Segera hadir</span>
                            </div>
                        </div>
                        <div className="stat-icon-wrapper stat-icon-muted">
                            <Calendar size={28} />
                        </div>
                    </div>
                </div>

                {/* Card 4 - Aktivitas (Coming Soon) */}
                <div className="stat-card stat-card-disabled">
                    <div className="stat-card-content">
                        <div className="stat-info">
                            <p className="stat-label">Aktivitas</p>
                            <h3 className="stat-value">-</h3>
                            <div className="stat-trend stat-trend-muted">
                                <Activity size={16} />
                                <span>Segera hadir</span>
                            </div>
                        </div>
                        <div className="stat-icon-wrapper stat-icon-muted">
                            <Activity size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="quick-actions-grid">
                    <a href="/dashboard/anggota" className="quick-action-card">
                        <div className="quick-action-icon">
                            <Users size={24} />
                        </div>
                        <div className="quick-action-content">
                            <h3>Kelola Anggota</h3>
                            <p>Tambah atau edit data anggota</p>
                        </div>
                    </a>

                    <a href="/dashboard/roadmaps" className="quick-action-card">
                        <div className="quick-action-icon">
                            <BookOpen size={24} />
                        </div>
                        <div className="quick-action-content">
                            <h3>Kelola Materi</h3>
                            <p>Atur roadmap & materi</p>
                        </div>
                    </a>

                    <a href="/dashboard/jadwal" className="quick-action-card">
                        <div className="quick-action-icon">
                            <Calendar size={24} />
                        </div>
                        <div className="quick-action-content">
                            <h3>Kelola Jadwal</h3>
                            <p>Atur jadwal latihan</p>
                        </div>
                    </a>

                    <a href="/dashboard/users" className="quick-action-card">
                        <div className="quick-action-icon">
                            <Award size={24} />
                        </div>
                        <div className="quick-action-content">
                            <h3>Kelola Users</h3>
                            <p>Manajemen akun pengguna</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};