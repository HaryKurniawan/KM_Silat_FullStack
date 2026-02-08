import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StepItem } from '../components/StepItem';
import { getIconByKey } from '../utils/iconMapper';
import { Trophy } from 'lucide-react';
import './RoadmapPage.css';
import { roadmapService } from '../services/api';

export const RoadmapPage = () => {
    const { category, subCategory } = useParams<{ category: string; subCategory?: string }>();
    const location = useLocation();
    const [roadmap, setRoadmap] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const isSeniSubCategory = location.pathname.startsWith('/seni/') && subCategory;

    useEffect(() => {
        const fetchRoadmap = async () => {
            setLoading(true);
            try {
                const categoriesResponse = await roadmapService.getCategories();
                const categories = categoriesResponse.data;

                let currentCategory;

                if (isSeniSubCategory) {
                    // For Seni subcategories (e.g., /seni/tunggal)
                    currentCategory = categories.find((c: any) => 
                        c.slug === subCategory && c.parentId !== null
                    );
                } else {
                    // For main categories (e.g., /tanding)
                    currentCategory = categories.find((c: any) =>
                        c.slug === category && c.parentId === null
                    );
                }

                if (currentCategory) {
                    const response = await roadmapService.getItemsByCategory(currentCategory.id);

                    setRoadmap({
                        title: currentCategory.judul,
                        subtitle: currentCategory.subjudul,
                        description: currentCategory.deskripsi,
                        accentColor: currentCategory.warnaAksen,
                        items: response.data.map((item: any) => ({
                            id: item.id,
                            title: item.judul,
                            description: item.deskripsi,
                            label: item.label,
                            videoUrl: item.videoUrl,
                            icon: item.ikon
                        }))
                    });
                } else {
                    setRoadmap(null);
                }
            } catch (error) {
                console.error("Failed to fetch roadmap", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [category, subCategory, isSeniSubCategory]);

    const backLink = isSeniSubCategory ? '/seni' : '/';

    const getDisplayTitle = () => {
        return roadmap?.title || '';
    };

    const getIcon = (size: number, className?: string) => {
        const key = category === 'tanding' ? 'technique' : 'art';
        return getIconByKey(key, size, className);
    };

    if (loading) {
        return (
            <div className="roadmap-page">
                <PageHeader backTo={backLink} title="Loading..." />
                <div className="roadmap-error">
                    <p>Memuat data latihan...</p>
                </div>
            </div>
        );
    }

    if (!roadmap || roadmap.items.length === 0) {
        return (
            <div className="roadmap-page">
                <PageHeader backTo={backLink} title="Tidak Ditemukan" />
                <div className="roadmap-error">
                    <p>Kategori tidak ditemukan atau belum ada materi</p>
                    <Link to={backLink} className="back-link">Kembali</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="roadmap-page">
            <PageHeader
                backTo={backLink}
                title={getDisplayTitle()}
                icon={getIcon(20)}
            />

            <section className="roadmap-hero">
                <div className="hero-icon-circle">
                    {getIcon(48)}
                </div>
                <h1 className="hero-title">{getDisplayTitle()}</h1>
                {roadmap.subtitle && <h2 className="hero-subtitle-small">{roadmap.subtitle}</h2>}
                <p className="hero-subtitle">{roadmap.description}</p>
            </section>

            <div className="progress-card">
                <h2 className="progress-title">Lanjutkan Perjalananmu!</h2>
                <p className="progress-text">Ikuti setiap langkah untuk persiapan yang maksimal.</p>
            </div>

            <section className="timeline-section">
                <div className="timeline-container">
                    {roadmap.items.map((item: any, index: number) => (
                        <StepItem
                            key={item.id}
                            item={{
                                id: item.id,
                                title: item.title,
                                description: item.description,
                                label: item.label,
                                videoUrl: item.videoUrl,
                                videoType: 'youtube',
                                detailedContent: '',
                                icon: item.icon
                            }}
                            category={isSeniSubCategory ? `seni/${subCategory}` : (category || '')}
                            index={index}
                            isLast={index === roadmap.items.length - 1}
                            accentColor={roadmap.accentColor}
                        />
                    ))}
                </div>

                <div className="final-reward">
                    <Trophy size={64} className="reward-icon-svg" color="#fbbf24" />
                    <div>
                        <h3 className="reward-title">{category === 'tanding' ? 'Siap Bertanding!' : 'Siap Tampil!'}</h3>
                        <p className="reward-text">Kamu siap menghadapi kejuaraan</p>
                    </div>
                </div>
            </section>
        </div>
    );
};