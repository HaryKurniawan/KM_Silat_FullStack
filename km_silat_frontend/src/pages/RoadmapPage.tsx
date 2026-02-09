import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { roadmapService } from '../services/api';
import { PageHeader } from '../components/PageHeader';
import { Play } from 'lucide-react';
import './RoadmapPage.css';

interface RoadmapItem {
    id: string;
    judul: string;
    deskripsi: string;
    label: string;
    videoUrl?: string;
    ikon?: string;
}

interface Category {
    id: string;
    judul: string;
    subjudul: string;
    deskripsi: string;
    slug: string;
    warnaAksen: string;
}

export const RoadmapPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState<RoadmapItem[]>([]);
    const [categoryData, setCategoryData] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Parse URL segments from location.pathname
    const segments = location.pathname.split('/').filter(Boolean);
    
    // Determine category and subCategory
    let category: string = '';
    let subCategory: string | undefined;

    if (segments.length === 1) {
        category = segments[0];
        subCategory = undefined;
    } else if (segments.length === 2) {
        category = segments[0];
        subCategory = segments[1];
    }

    console.log('🔍 RoadmapPage - location.pathname:', location.pathname);
    console.log('🔍 RoadmapPage - segments:', segments);
    console.log('✅ RoadmapPage - category:', category);
    console.log('✅ RoadmapPage - subCategory:', subCategory);

    useEffect(() => {
        if (!category) {
            setError('Kategori tidak valid');
            setLoading(false);
            return;
        }
        
        loadCategoryAndItems();
    }, [location.pathname]);

    const loadCategoryAndItems = async () => {
        setLoading(true);
        setError(null);

        try {
            const slug = subCategory || category;
            
            console.log('📍 RoadmapPage - Loading data for slug:', slug);

            const categoryResponse = await roadmapService.getCategoryBySlug(slug);
            console.log('✅ Category response:', categoryResponse.data);
            setCategoryData(categoryResponse.data);

            const itemsResponse = await roadmapService.getItemsByCategorySlug(slug);
            console.log('✅ Items response:', itemsResponse.data);
            setItems(itemsResponse.data);

        } catch (err: any) {
            console.error('❌ Error loading roadmap:', err);
            setError(err.response?.data?.message || 'Gagal memuat data roadmap');
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (item: RoadmapItem) => {
        console.log('🖱️ Item clicked:', item);
        console.log('🔗 Current location:', location.pathname);
        console.log('🔗 category:', category);
        console.log('🔗 subCategory:', subCategory);
        
        let path: string;
        if (subCategory) {
            path = `/${category}/${subCategory}/${item.id}`;
        } else {
            path = `/${category}/${item.id}`;
        }
        
        console.log('🔗 Navigating to:', path);
        navigate(path);
    };

    const getBackPath = () => {
        if (subCategory && category) {
            return `/${category}`;
        }
        return '/';
    };

    if (loading) {
        return (
            <div className="roadmap-loading">
                <p>Memuat roadmap...</p>
            </div>
        );
    }

    if (error || !categoryData) {
        return (
            <div className="roadmap-error-container">
                <p className="error-message">
                    ❌ {error || 'Kategori tidak ditemukan'}
                </p>
                <div className="debug-info">
                    <p><strong>Debug Info:</strong></p>
                    <p>URL: {location.pathname}</p>
                    <p>Category: {category || 'undefined'}</p>
                    <p>SubCategory: {subCategory || 'none'}</p>
                </div>
                <button 
                    onClick={() => navigate(getBackPath())}
                    className="back-button"
                >
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="roadmap-page">
            <PageHeader
                title={categoryData.judul}
                subtitle={categoryData.subjudul}
                backTo={getBackPath()}
            />

            <div className="roadmap-content">
                <p className="roadmap-description">
                    {categoryData.deskripsi}
                </p>

                {items.length === 0 ? (
                    <div className="empty-state">
                        <p>Belum ada materi tersedia untuk kategori ini.</p>
                    </div>
                ) : (
                    <div className="roadmap-grid">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="roadmap-item-card"
                                onClick={() => handleItemClick(item)}
                            >
                                <div className="item-header">
                                    <h3 className="item-title">{item.judul}</h3>
                                    <span className="item-label">{item.label}</span>
                                </div>

                                <p className="item-description">
                                    {item.deskripsi}
                                </p>

                                {item.videoUrl && (
                                    <div className="item-video-badge">
                                        <Play size={16} />
                                        <span>Video tersedia</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};