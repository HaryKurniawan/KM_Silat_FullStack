import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Drama, ChevronRight, Lightbulb } from 'lucide-react';
import './SeniSelectionPage.css';
import { roadmapService } from '../services/api';
import { getIcon } from '../utils/iconMapper';

interface SubCategory {
    id: string;
    judul: string;
    deskripsi: string;
    ikon: string;
}

export const SeniSelectionPage = () => {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await roadmapService.getItemsByCategory('seni');
                setSubCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch Seni items", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="seni-selection-page">
            <PageHeader
                backTo="/"
                title="Kategori Seni"
                subtitle="Pilih jenis seni"
                icon={<Drama size={20} />}
            />

            <section className="seni-hero">
                <div className="hero-icon-wrapper">
                    <Drama size={48} className="hero-icon-svg" />
                </div>
                <h1 className="hero-title">Kategori Seni</h1>
                <p className="hero-subtitle">Pilih jenis seni yang ingin dipelajari</p>
            </section>

            <section className="subcategories-section">
                <div className="subcategories-grid">
                    {loading ? (
                        <div style={{ color: 'white', textAlign: 'center', width: '100%' }}>Loading...</div>
                    ) : subCategories.length > 0 ? (
                        subCategories.map((sub, index) => (
                            <Link key={sub.id} to={`/roadmap/seni/${sub.id}`} className="subcategory-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="subcategory-icon-wrapper">
                                    <span className="subcategory-icon">{getIcon(sub.ikon, 32)}</span>
                                </div>
                                <div className="subcategory-content">
                                    <h3 className="subcategory-title">{sub.judul}</h3>
                                    <p className="subcategory-subtitle">{sub.deskripsi}</p>
                                </div>
                                <div className="subcategory-arrow">
                                    <ChevronRight size={20} />
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div style={{ color: 'white', textAlign: 'center', width: '100%' }}>Belum ada materi.</div>
                    )}
                </div>
            </section>

            <section className="info-section">
                <div className="info-card">
                    <div className="info-icon-wrapper">
                        <Lightbulb size={24} className="info-icon-svg" />
                    </div>
                    <div>
                        <h4 className="info-title">Tentang Kategori Seni</h4>
                        <p className="info-text">Kategori seni menampilkan keindahan gerakan pencak silat dengan penilaian pada aspek wiraga, wirama, dan wirasa.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};