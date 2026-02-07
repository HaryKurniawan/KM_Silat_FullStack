import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StepItem } from '../assets/StepItem';
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
    const actualCategory = isSeniSubCategory ? 'seni' : category;

    useEffect(() => {
        const fetchRoadmap = async () => {
            setLoading(true);
            try {
                if (actualCategory) {
                    // 1. Fetch all categories
                    const categoriesResponse = await roadmapService.getCategories();
                    const categories = categoriesResponse.data;

                    // 2. Find the category that matches the URL slug (actualCategory)
                    const currentCategory = categories.find((c: any) =>
                        c.id === actualCategory ||
                        c.judul.toLowerCase().includes(actualCategory.toLowerCase())
                    );

                    if (currentCategory) {
                        // 3. Fetch items using the REAL database UUID
                        const response = await roadmapService.getItemsByCategory(currentCategory.id);

                        setRoadmap({
                            title: currentCategory.judul,
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
                }
            } catch (error) {
                console.error("Failed to fetch roadmap", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [actualCategory, subCategory, isSeniSubCategory]);

    const backLink = isSeniSubCategory ? '/seni' : '/';

    const getDisplayTitle = () => {
        if (isSeniSubCategory && subCategory === 'tunggal') return 'Jurus Tunggal';
        return roadmap?.title || '';
    };

    const getIcon = (size: number, className?: string) => {
        const key = actualCategory === 'tanding' ? 'technique' : 'art';
        return getIconByKey(key, size, className);
    };

    if (loading) {
        return (
            <div className="roadmap-page">
                <PageHeader backTo="/" title="Loading..." />
                <div className="roadmap-error">
                    <p>Memuat data latihan...</p>
                </div>
            </div>
        );
    }

    if (!roadmap || roadmap.items.length === 0) {
        return (
            <div className="roadmap-page">
                <PageHeader backTo="/" title="Tidak Ditemukan" />
                <div className="roadmap-error">
                    <p>Kategori tidak ditemukan</p>
                    <Link to="/" className="back-link">Kembali</Link>
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
                                videoType: 'youtube', // Assuming default
                                detailedContent: '', // Will be fetched in detail page
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
                        <h3 className="reward-title">{actualCategory === 'tanding' ? 'Siap Bertanding!' : 'Siap Tampil!'}</h3>
                        <p className="reward-text">Kamu siap menghadapi kejuaraan</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
