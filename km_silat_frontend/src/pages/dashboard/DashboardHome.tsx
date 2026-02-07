import { useState, useEffect } from 'react';
import { Users, BookOpen, Activity, Loader2 } from 'lucide-react';
import { statsService } from '../../services/api';

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

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: 'var(--text-primary)' }}>Dashboard Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Anggota</p>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                                {loading ? <Loader2 className="animate-spin" size={24} /> : stats?.totalAnggota ?? 0}
                            </h3>
                        </div>
                        <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <Users color="#fbbf24" size={24} />
                        </div>
                    </div>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Materi Aktif</p>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                                {loading ? <Loader2 className="animate-spin" size={24} /> : stats?.totalMateri ?? 0}
                            </h3>
                        </div>
                        <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <BookOpen color="#fbbf24" size={24} />
                        </div>
                    </div>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', opacity: 0.7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Aktivitas (Soon)</p>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0.5rem 0' }}>-</h3>
                        </div>
                        <div style={{ background: 'rgba(163, 163, 163, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <Activity color="#a3a3a3" size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
