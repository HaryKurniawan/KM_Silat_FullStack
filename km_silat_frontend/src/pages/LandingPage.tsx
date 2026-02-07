import { useState, useEffect } from 'react';
import { CategoryCard } from '../components/CategoryCard';
import { Header } from '../components/Header';
import { Swords, Drama, ChartBar, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import './LandingPage.css';
import { jadwalService } from '../services/api';

export const LandingPage = () => {
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [scheduleData, setScheduleData] = useState<any[]>([]);

    useEffect(() => {
        const fetchJadwal = async () => {
            try {
                const response = await jadwalService.getAll();
                setScheduleData(response.data);
            } catch (error) {
                console.error('Failed to fetch schedule', error);
                // Fallback to empty or basic info
            }
        };
        fetchJadwal();
    }, []);

    const todayIndex = new Date().getDay();
    const todaySchedule = scheduleData.find(s => s.id === todayIndex) || { status: '...', waktu: '-' };

    return (
        <>
            <Header />
            <div className="landing-page">
                <div className="landing-background-glow"></div>

                {/* Hero Section */}
                <section className="landing-hero animate-fade-in">
                    <h1 className="hero-title">Manajemen <span className="text-gradient">Pengetahuan</span> & <span className="text-gradient">Persiapan</span> Juara</h1>
                    <p className="hero-subtitle">Platform digital untuk mengasah teknik dan cetak prestasi juara.</p>

                    <div className="schedule-container" style={{ marginTop: 'var(--spacing-xl)' }}>
                        <button
                            className={`schedule-dropdown-btn ${todaySchedule.status === 'Latihan' ? 'active-day' : ''}`}
                            onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                        >
                            <div className="dropdown-left">
                                <Calendar size={20} />
                                <div className="dropdown-text simple">
                                    <span className="schedule-label">Hari ini:</span>
                                    <span className="schedule-value">{todaySchedule.status}</span>
                                    {todaySchedule.status === 'Latihan' && todaySchedule.kategori && (
                                        <span className="schedule-category">({todaySchedule.kategori})</span>
                                    )}
                                    {todaySchedule.status === 'Latihan' && <span className="schedule-time">({todaySchedule.waktu})</span>}
                                </div>
                            </div>
                            {isScheduleOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        <div className={`schedule-dropdown-content ${isScheduleOpen ? 'open' : ''}`}>
                            {scheduleData.map((item) => (
                                <div
                                    key={item.id}
                                    className={`schedule-row ${item.id === todayIndex ? 'current-day' : ''} ${item.status === 'Latihan' ? 'training-day' : 'rest-day'}`}
                                >
                                    <span className="row-day">{item.hari}</span>
                                    <div className="row-status-group">
                                        <span className="row-status">{item.status}</span>
                                        {item.status === 'Latihan' && item.kategori && (
                                            <span className="row-category">({item.kategori})</span>
                                        )}
                                    </div>
                                    {item.status === 'Latihan' && (
                                        <span className="row-time">{item.waktu}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Main Menu Sections */}
                <div className="landing-content animate-slide-up">
                    {/* Roadmap / Latihan Section */}
                    <section className="menu-section">
                        <div className="section-header">
                            <span className="section-number">01</span>
                            <h2 className="section-title">Kurikulum Latihan (Roadmap)</h2>
                            <p className="section-desc">Panduan bertahap untuk menguasai teknik silat dari dasar hingga mahir.</p>
                        </div>
                        <div className="category-grid">
                            <CategoryCard
                                title="Tanding"
                                subtitle="Seni Bertarung & Strategi"
                                icon={<Swords size={40} />}
                                to="/tanding"
                            />
                            <CategoryCard
                                title="Seni"
                                subtitle="Keindahan Gerak & Jurus"
                                icon={<Drama size={40} />}
                                to="/seni"
                            />
                        </div>
                    </section>

                    <div className="section-divider"></div>

                    {/* Data & Information Section */}
                    <section className="menu-section">
                        <div className="section-header">
                            <span className="section-number">02</span>
                            <h2 className="section-title">Pusat Data</h2>
                            <p className="section-desc">Kelola dan lihat data anggota serta histori prestasi kejuaraan secara transparan.</p>
                        </div>
                        <div className="info-grid">
                            <CategoryCard
                                title="Expert Locator"
                                subtitle="Database Anggota & Rekam Jejak Prestasi"
                                icon={<ChartBar size={40} />}
                                to="/knowledge-management"
                            />
                        </div>
                    </section>


                </div>

                {/* Footer */}
                <footer className="landing-footer">
                    <div className="footer-line"></div>
                    <p>© 2024 UKM Pencak Silat • Bersama Membangun Prestasi</p>
                </footer>
            </div>
        </>
    );
};