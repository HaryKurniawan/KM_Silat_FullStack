import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roadmapService } from '../services/api';
import { PageHeader } from '../components/PageHeader';
import { CommentSection } from '../components/CommentSection';
import { Play, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [item, setItem] = useState<ItemDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [backPath, setBackPath] = useState('/');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Parse URL segments
    const segments = window.location.pathname.split('/').filter(Boolean);
    const knownSeniSubcategories = ['tunggal', 'berpasangan', 'regu', 'ganda'];
    
    let itemId: string;
    let category: string;
    let subCategory: string | undefined;
    
    if (segments.length === 2) {
        category = segments[0];
        itemId = segments[1];
    } else if (segments.length === 3) {
        category = segments[0];
        subCategory = segments[1];
        itemId = segments[2];
    } else {
        category = segments[0] || '';
        itemId = segments[segments.length - 1] || '';
    }

    console.log('📍 DetailPage - Route segments:', segments);
    console.log('📍 DetailPage - itemId:', itemId);
    console.log('📍 DetailPage - category:', category);
    console.log('📍 DetailPage - subCategory:', subCategory);

    useEffect(() => {
        // Check if this is actually a subcategory page, not a detail page
        if (segments.length === 2 && category === 'seni' && knownSeniSubcategories.includes(segments[1])) {
            console.log('⚠️ This is a subcategory page, redirecting...');
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
            const categoriesResponse = await roadmapService.getCategories();
            const allCategories = categoriesResponse.data;
            
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

    // Fungsi khusus untuk reload komentar saja (tanpa loading full page)
    const reloadComments = async () => {
        if (!itemId) return;
        
        try {
            console.log('🔄 Reloading comments only...');
            const response = await roadmapService.getItemDetail(itemId);
            
            // Update hanya bagian komentar
            setItem(prevItem => {
                if (!prevItem) return response.data;
                return {
                    ...prevItem,
                    komentar: response.data.komentar
                };
            });
            
            console.log('✅ Comments reloaded');
        } catch (err) {
            console.error('❌ Error reloading comments:', err);
        }
    };

    const handleBack = () => {
        navigate(backPath);
    };

    const handleSubmitComment = async (e: React.FormEvent, parentId?: string) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            alert('Silakan login terlebih dahulu untuk berkomentar');
            navigate('/login');
            return;
        }

        if (!commentText.trim() || !itemId) return;

        setIsSubmittingComment(true);

        try {
            await roadmapService.addComment(itemId, {
                isi: commentText,
                namaPengguna: user?.username || 'Anonymous',
                parentId
            });
            
            setCommentText('');
            setReplyingTo(null);
            
            // Reload hanya komentar, bukan seluruh halaman
            await reloadComments();
        } catch (err) {
            console.error('Error posting comment:', err);
            alert('Gagal mengirim komentar');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleLikeComment = async (commentId: string) => {
        if (!isAuthenticated) {
            alert('Silakan login terlebih dahulu untuk menyukai komentar');
            navigate('/login');
            return;
        }

        try {
            await roadmapService.likeComment(commentId);
            
            // Reload hanya komentar
            await reloadComments();
        } catch (err) {
            console.error('Error liking comment:', err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!isAuthenticated) {
            alert('Silakan login terlebih dahulu');
            navigate('/login');
            return;
        }

        try {
            await roadmapService.deleteComment(commentId);
            
            // Reload hanya komentar
            await reloadComments();
        } catch (err) {
            console.error('Error deleting comment:', err);
            alert('Gagal menghapus komentar');
        }
    };

    const renderVideo = () => {
        if (!item?.videoUrl) return null;

        const isYouTube = item.tipeVideo === 'youtube' || 
                          item.videoUrl.includes('youtube.com') || 
                          item.videoUrl.includes('youtu.be');
        
        if (isYouTube) {
            const videoId = item.videoUrl.includes('youtu.be') 
                ? item.videoUrl.split('youtu.be/')[1]?.split('?')[0]
                : item.videoUrl.split('v=')[1]?.split('&')[0];
            
            if (videoId) {
                return (
                    <div className="video-container">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            allowFullScreen
                            title={item.judul}
                        />
                    </div>
                );
            }
        }

        return (
            <div className="external-video-link">
                <Play size={48} />
                <a 
                    href={item.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Tonton Video
                </a>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p>Memuat detail materi...</p>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="error-container">
                <p className="error-message">❌ {error || 'Materi tidak ditemukan'}</p>
                <button onClick={handleBack} className="back-button">
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
                {item.videoUrl && (
                    <div className="video-section">
                        {renderVideo()}
                    </div>
                )}

                {/* Description */}
                <div className="content-section">
                    <div className="content-card">
                        <h3 className="content-card-title">
                            <FileText size={20} /> Deskripsi
                        </h3>
                        <p className="content-card-text">{item.deskripsi}</p>
                    </div>
                </div>

                {/* Detailed Content */}
                {item.kontenDetail && (
                    <div className="content-section">
                        <div className="content-card">
                            <h3 className="content-card-title">Detail Materi</h3>
                            <div 
                                className="content-detail"
                                dangerouslySetInnerHTML={{ __html: item.kontenDetail }}
                            />
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                <div className="content-section">
                    <CommentSection
                        comments={item.komentar || []}
                        isAuthenticated={isAuthenticated}
                        username={user?.username}
                        commentText={commentText}
                        replyingTo={replyingTo}
                        isSubmitting={isSubmittingComment}
                        onCommentTextChange={setCommentText}
                        onSubmitComment={handleSubmitComment}
                        onLikeComment={handleLikeComment}
                        onDeleteComment={handleDeleteComment}
                        onReplyClick={setReplyingTo}
                        onCancelReply={() => {
                            setReplyingTo(null);
                            setCommentText('');
                        }}
                    />
                </div>
            </div>
        </div>
    );
};