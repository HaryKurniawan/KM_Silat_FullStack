import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roadmapService } from '../services/api';
import { PageHeader } from '../components/PageHeader';
import { Play, FileText, MessageCircle, ThumbsUp, Send } from 'lucide-react';
import './DetailPage.css';

interface Comment {
    id: string;
    isi: string;
    namaPengguna: string;
    avatarPengguna: string;
    suka: number;
    disukai: boolean;
    createdAt: string;
    replies?: Comment[];
}

interface ItemDetail {
    id: string;
    judul: string;
    deskripsi: string;
    label: string;
    videoUrl?: string;
    tipeVideo?: string;
    kontenDetail?: string;
    ikon?: string;
    komentar?: Comment[];
}

export const DetailPage = () => {
    // const params = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<ItemDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [userName, setUserName] = useState('');
    const [backPath, setBackPath] = useState('/');

    // Intelligent itemId detection
    // Route patterns:
    // 1. /:category/:itemId (2 segments) - e.g., /tanding/teknik-pukulan
    // 2. /:category/:subCategory/:itemId (3 segments) - e.g., /seni/tunggal/gerak-1
    
    const segments = window.location.pathname.split('/').filter(Boolean);
    
    // Determine if this is a detail page or roadmap page
    // Known subcategories for 'seni': tunggal, berpasangan, regu
    const knownSeniSubcategories = ['tunggal', 'berpasangan', 'regu'];
    
    let itemId: string;
    let category: string;
    let subCategory: string | undefined;
    
    if (segments.length === 2) {
        // Pattern: /:category/:itemId
        category = segments[0];
        itemId = segments[1];
    } else if (segments.length === 3) {
        // Pattern: /:category/:subCategory/:itemId
        category = segments[0];
        subCategory = segments[1];
        itemId = segments[2];
    } else {
        // Fallback
        category = segments[0] || '';
        itemId = segments[segments.length - 1] || '';
    }

    console.log('📍 Route segments:', segments);
    console.log('📍 Detected itemId:', itemId);
    console.log('📍 Category:', category);
    console.log('📍 SubCategory:', subCategory);

    useEffect(() => {
        // Check if this is actually a subcategory page, not a detail page
        if (segments.length === 2 && category === 'seni' && knownSeniSubcategories.includes(segments[1])) {
            console.log('⚠️ This is a subcategory page, not a detail page. Redirecting...');
            navigate(`/seni/${segments[1]}`);
            return;
        }

        if (itemId) {
            loadItemDetail();
            determineBackPath();
        }
    }, [itemId, category, subCategory]);

    const determineBackPath = async () => {
        try {
            // Fetch categories to determine proper back path
            const categoriesResponse = await roadmapService.getCategories();
            const allCategories = categoriesResponse.data;
            
            // Helper to find category by slug recursively
            const findCategoryBySlug = (categories: any[], slug: string): any => {
                for (const cat of categories) {
                    if (cat.slug.toLowerCase() === slug?.toLowerCase()) {
                        return cat;
                    }
                    if (cat.subCategories && cat.subCategories.length > 0) {
                        const found = findCategoryBySlug(cat.subCategories, slug);
                        if (found) return found;
                    }
                }
                return null;
            };
            
            if (subCategory) {
                // Check if subCategory is actually a subcategory
                const mainCat = findCategoryBySlug(allCategories, category || '');
                if (mainCat?.subCategories?.some((sc: any) => sc.slug === subCategory)) {
                    setBackPath(`/${category}/${subCategory}`);
                } else {
                    setBackPath(`/${category}`);
                }
            } else {
                setBackPath(`/${category}`);
            }
        } catch (err) {
            console.error('Error determining back path:', err);
            setBackPath('/');
        }
    };

    const loadItemDetail = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔍 Loading item detail for:', itemId);
            const response = await roadmapService.getItemDetail(itemId);
            setItem(response.data);
            console.log('✅ Item loaded:', response.data);
        } catch (err: any) {
            console.error('❌ Error loading item:', err);
            setError(err.response?.data?.message || 'Gagal memuat detail materi');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(backPath);
    };

    const handleSubmitComment = async (e: React.FormEvent, parentId?: string) => {
        e.preventDefault();
        
        if (!commentText.trim() || !itemId) return;

        try {
            await roadmapService.addComment(itemId, {
                isi: commentText,
                namaPengguna: userName || 'Anonymous',
                parentId
            });
            
            setCommentText('');
            setReplyingTo(null);
            await loadItemDetail();
        } catch (err) {
            console.error('Error posting comment:', err);
            alert('Gagal mengirim komentar');
        }
    };

    const handleLikeComment = async (commentId: string) => {
        try {
            await roadmapService.likeComment(commentId);
            await loadItemDetail();
        } catch (err) {
            console.error('Error liking comment:', err);
        }
    };

    const renderVideo = () => {
        if (!item?.videoUrl) return null;

        const isYouTube = item.tipeVideo === 'youtube' || item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be');
        
        if (isYouTube) {
            const videoId = item.videoUrl.includes('youtu.be') 
                ? item.videoUrl.split('youtu.be/')[1]?.split('?')[0]
                : item.videoUrl.split('v=')[1]?.split('&')[0];
            
            if (videoId) {
                return (
                    <div style={{
                        position: 'relative',
                        paddingBottom: '56.25%',
                        height: 0,
                        overflow: 'hidden',
                        borderRadius: 'var(--border-radius)',
                        marginBottom: '2rem'
                    }}>
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            allowFullScreen
                            title={item.judul}
                        />
                    </div>
                );
            }
        }

        return (
            <div style={{
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                marginBottom: '2rem'
            }}>
                <Play size={48} style={{ color: '#fbbf24', marginBottom: '1rem' }} />
                <a 
                    href={item.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold' }}
                >
                    Tonton Video
                </a>
            </div>
        );
    };

    const renderComment = (comment: Comment, isReply: boolean = false) => (
        <div 
            key={comment.id} 
            style={{
                background: isReply ? 'var(--bg-primary)' : 'var(--bg-card)',
                padding: '1rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--border-color)',
                marginLeft: isReply ? '2rem' : '0'
            }}
        >
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                <img 
                    src={comment.avatarPengguna} 
                    alt={comment.namaPengguna}
                    style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%',
                        background: '#fbbf24'
                    }}
                />
                <div style={{ flex: 1 }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                    }}>
                        <span style={{ 
                            fontWeight: 'bold', 
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem'
                        }}>
                            {comment.namaPengguna}
                        </span>
                        <span style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--text-secondary)' 
                        }}>
                            {new Date(comment.createdAt).toLocaleDateString('id-ID')}
                        </span>
                    </div>
                    <p style={{ 
                        color: 'var(--text-secondary)', 
                        margin: '0 0 0.75rem 0',
                        lineHeight: '1.5'
                    }}>
                        {comment.isi}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                            onClick={() => handleLikeComment(comment.id)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: comment.disukai ? '#fbbf24' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.85rem',
                                padding: '0.25rem 0.5rem'
                            }}
                        >
                            <ThumbsUp size={16} fill={comment.disukai ? '#fbbf24' : 'none'} />
                            {comment.suka}
                        </button>
                        {!isReply && (
                            <button
                                onClick={() => setReplyingTo(comment.id)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    padding: '0.25rem 0.5rem'
                                }}
                            >
                                Balas
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
                <form 
                    onSubmit={(e) => handleSubmitComment(e, comment.id)}
                    style={{ marginTop: '1rem', marginLeft: '3rem' }}
                >
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Tulis balasan..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            resize: 'vertical',
                            minHeight: '80px',
                            marginBottom: '0.5rem'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            type="submit"
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#fbbf24',
                                color: '#111827',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Send size={16} /> Kirim
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setReplyingTo(null);
                                setCommentText('');
                            }}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Batal
                        </button>
                    </div>
                </form>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {comment.replies.map(reply => renderComment(reply, true))}
                </div>
            )}
        </div>
    );

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
                <p>Memuat detail materi...</p>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                background: 'var(--bg-primary)', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '1rem',
                color: 'var(--text-primary)'
            }}>
                <p style={{ color: '#ef4444' }}>❌ {error || 'Materi tidak ditemukan'}</p>
                <button 
                    onClick={handleBack}
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
        <div className="detail-page">
            <PageHeader
                title={item.judul}
                subtitle={item.label}
                backTo={backPath}
            />

            <div className="detail-content">
                {/* Video Section */}
                {renderVideo()}

                {/* Description */}
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{ 
                        color: 'var(--text-primary)', 
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <FileText size={20} /> Deskripsi
                    </h3>
                    <p style={{ 
                        color: 'var(--text-secondary)', 
                        lineHeight: '1.6',
                        margin: 0
                    }}>
                        {item.deskripsi}
                    </p>
                </div>

                {/* Detailed Content */}
                {item.kontenDetail && (
                    <div style={{
                        background: 'var(--bg-card)',
                        padding: '1.5rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)',
                        marginBottom: '2rem'
                    }}>
                        <h3 style={{ 
                            color: 'var(--text-primary)', 
                            marginBottom: '1rem'
                        }}>
                            Detail Materi
                        </h3>
                        <div 
                            style={{ 
                                color: 'var(--text-secondary)', 
                                lineHeight: '1.8',
                                whiteSpace: 'pre-wrap'
                            }}
                            dangerouslySetInnerHTML={{ __html: item.kontenDetail }}
                        />
                    </div>
                )}

                {/* Comments Section */}
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{ 
                        color: 'var(--text-primary)', 
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <MessageCircle size={20} /> 
                        Komentar ({item.komentar?.length || 0})
                    </h3>

                    {/* Comment Form */}
                    <form onSubmit={(e) => handleSubmitComment(e)} style={{ marginBottom: '2rem' }}>
                        <input
                            type="text"
                            placeholder="Nama Anda (opsional)"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                marginBottom: '0.75rem'
                            }}
                        />
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Tulis komentar..."
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                resize: 'vertical',
                                minHeight: '100px',
                                marginBottom: '0.75rem'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#fbbf24',
                                color: '#111827',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Send size={16} /> Kirim Komentar
                        </button>
                    </form>

                    {/* Comments List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {item.komentar && item.komentar.length > 0 ? (
                            item.komentar.map(comment => renderComment(comment))
                        ) : (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                                Belum ada komentar. Jadilah yang pertama!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};