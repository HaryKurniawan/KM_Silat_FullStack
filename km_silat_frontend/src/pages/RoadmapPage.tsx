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
    }, [location.pathname]); // Trigger re-load saat URL berubah

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
        
        // Build path using current values
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
            <div style={{ 
                minHeight: '100vh', 
                background: 'var(--bg-primary)', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'var(--text-primary)'
            }}>
                <p>Memuat roadmap...</p>
            </div>
        );
    }

    if (error || !categoryData) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                background: 'var(--bg-primary)', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '1rem',
                color: 'var(--text-primary)',
                padding: '2rem'
            }}>
                <p style={{ color: '#ef4444', fontSize: '1.2rem' }}>
                    ❌ {error || 'Kategori tidak ditemukan'}
                </p>
                <div style={{ 
                    background: 'var(--bg-card)', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '500px',
                    width: '100%'
                }}>
                    <p><strong>Debug Info:</strong></p>
                    <p>URL: {location.pathname}</p>
                    <p>Category: {category || 'undefined'}</p>
                    <p>SubCategory: {subCategory || 'none'}</p>
                </div>
                <button 
                    onClick={() => navigate(getBackPath())}
                    style={{ 
                        padding: '0.75rem 1.5rem', 
                        background: '#fbbf24', 
                        color: '#111827',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
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
                <p style={{ 
                    color: 'var(--text-secondary)', 
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                }}>
                    {categoryData.deskripsi}
                </p>

                {items.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: 'var(--text-secondary)'
                    }}>
                        <p>Belum ada materi tersedia untuk kategori ini.</p>
                    </div>
                ) : (
                    <div className="roadmap-grid">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="roadmap-item-card"
                                onClick={() => handleItemClick(item)}
                                style={{
                                    background: 'var(--bg-card)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--border-radius)',
                                    border: '1px solid var(--border-color)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'flex-start', 
                                    marginBottom: '0.75rem' 
                                }}>
                                    <h3 style={{ 
                                        margin: 0, 
                                        color: 'var(--text-primary)',
                                        fontSize: '1.1rem',
                                        fontWeight: '600'
                                    }}>
                                        {item.judul}
                                    </h3>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: categoryData.warnaAksen,
                                        border: `1px solid ${categoryData.warnaAksen}`,
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {item.label}
                                    </span>
                                </div>

                                <p style={{ 
                                    color: 'var(--text-secondary)', 
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    marginBottom: '1rem'
                                }}>
                                    {item.deskripsi}
                                </p>

                                {item.videoUrl && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: categoryData.warnaAksen,
                                        fontSize: '0.85rem'
                                    }}>
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