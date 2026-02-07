import { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import {
    BookOpen,
    MessageSquare,
    Heart,
    User,
    ArrowLeft,
    Trash2,
    LogIn
} from 'lucide-react';
import './DetailPage.css';
import { roadmapService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DetailPage = () => {
    const { category, subCategory, itemId } = useParams<{ category: string; subCategory?: string; itemId: string }>();
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Tabs state
    const [activeTab, setActiveTab] = useState<'detail' | 'discussion'>('detail');

    // Data state
    const [item, setItem] = useState<any>(null);
    const [categoryData, setCategoryData] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [replyingToId, setReplyingToId] = useState<string | null>(null);

    const isSeniSubCategory = location.pathname.startsWith('/seni/') && subCategory;
    const actualCategory = isSeniSubCategory ? 'seni' : category;

    const fetchComments = async () => {
        if (!itemId) return;
        try {
            const response = await roadmapService.getCommentsByItem(itemId);
            setComments(response.data);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };

    useEffect(() => {
        const fetchDetail = async () => {
            if (!itemId) return;
            setLoading(true);
            try {
                if (actualCategory) {
                    // 1. Fetch categories to find the REAL UUID
                    const catsResponse = await roadmapService.getCategories();
                    const categories = catsResponse.data;

                    const currentCat = categories.find((c: any) =>
                        c.id === actualCategory ||
                        c.judul.toLowerCase().includes(actualCategory.toLowerCase())
                    );

                    if (currentCat) {
                        setCategoryData(currentCat);

                        // 2. Fetch Items for this category using the REAL UUID
                        const response = await roadmapService.getItemsByCategory(currentCat.id);
                        const foundItem = response.data.find((i: any) => i.id === itemId);

                        if (foundItem) {
                            setItem({
                                title: foundItem.judul,
                                description: foundItem.deskripsi,
                                videoUrl: foundItem.videoUrl,
                                detailedContent: foundItem.kontenDetail,
                            });

                            // 3. Fetch Comments
                            await fetchComments();
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch detail", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [itemId, actualCategory]);

    const backLink = isSeniSubCategory ? `/seni/${subCategory}` : `/${category}`;

    if (loading) {
        return (
            <div className="detail-page">
                <PageHeader backTo={backLink} title="Loading..." />
                <div className="detail-error">
                    <p>Memuat detail materi...</p>
                </div>
            </div>
        );
    }

    if (!item) return null;

    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        return match ? match[1] : null;
    };

    const videoId = getYouTubeId(item.videoUrl);

    const handleAddComment = async (parentId?: string) => {
        if (!newComment.trim() || !itemId || !isAuthenticated) return;

        try {
            await roadmapService.addComment(itemId, {
                isi: newComment,
                namaPengguna: user?.username || 'Anonymous',
                parentId: parentId || undefined
            });
            await fetchComments();
            setNewComment('');
            setReplyingToId(null);
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleDeleteComment = async (id: string) => {
        if (confirm('Hapus komentar ini?')) {
            try {
                await roadmapService.deleteComment(id);
                await fetchComments();
            } catch (error) {
                console.error("Failed to delete comment", error);
            }
        }
    };

    const handleLike = async (id: string) => {
        if (!isAuthenticated) {
            alert('Silakan login terlebih dahulu untuk menyukai komentar');
            return;
        }

        try {
            await roadmapService.likeComment(id);
            // Optimistic update
            setComments(comments.map((c: any) => {
                if (c.id === id) {
                    return {
                        ...c,
                        likes: c.disukai ? (c.suka || 0) - 1 : (c.suka || 0) + 1,
                        disukai: !c.disukai,
                        suka: c.disukai ? (c.suka || 0) - 1 : (c.suka || 0) + 1
                    };
                }
                // Also check replies
                if (c.replies) {
                    return {
                        ...c,
                        replies: c.replies.map((r: any) => {
                            if (r.id === id) {
                                return {
                                    ...r,
                                    disukai: !r.disukai,
                                    suka: r.disukai ? (r.suka || 0) - 1 : (r.suka || 0) + 1
                                };
                            }
                            return r;
                        })
                    };
                }
                return c;
            }));
        } catch (error) {
            console.error("Failed to like comment", error);
        }
    };

    const handleReplyClick = (commentId: string) => {
        if (!isAuthenticated) {
            alert('Silakan login terlebih dahulu untuk membalas komentar');
            return;
        }
        setReplyingToId(commentId === replyingToId ? null : commentId);
    };

    const renderComment = (comment: any, isReply = false) => (
        <div key={comment.id} className={`comment-group ${isReply ? 'reply-group' : 'main-group'}`}>
            <div className={`comment-item ${isReply ? 'is-reply' : 'is-main'}`}>
                <div className="comment-avatar">
                    <User size={isReply ? 18 : 22} />
                </div>
                <div className="comment-content-wrapper">
                    <div className="comment-header">
                        <div className="author-info">
                            <span className="comment-author">{comment.namaPengguna}</span>
                            <span className="dot-separator">•</span>
                            <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <p className="comment-text">{comment.isi}</p>
                    <div className="comment-actions">
                        <button 
                            className={`action-btn like-btn ${comment.disukai ? 'liked' : ''}`} 
                            onClick={() => handleLike(comment.id)}
                        >
                            <Heart size={14} fill={comment.disukai ? "currentColor" : "none"} />
                            <span>{comment.suka || 0}</span>
                        </button>
                        {!isReply && (
                            <button
                                className="action-btn reply-btn"
                                onClick={() => handleReplyClick(comment.id)}
                            >
                                <MessageSquare size={14} />
                                <span>Balas</span>
                            </button>
                        )}
                        {/* Admin or Comment Owner can delete */}
                        {(user?.role === 'ADMIN' || (user && user.username === comment.namaPengguna)) && (
                            <button className="action-btn delete-btn" onClick={() => handleDeleteComment(comment.id)}>
                                <Trash2 size={14} />
                                <span>Hapus</span>
                            </button>
                        )}
                    </div>

                    {/* Inline Reply Form - Only show if logged in */}
                    {replyingToId === comment.id && isAuthenticated && (
                        <div className="inline-reply-form animate-fade-in">
                            <textarea
                                placeholder={`Balas ke ${comment.namaPengguna}...`}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="comment-input inline"
                                rows={2}
                                autoFocus
                            />
                            <div className="inline-form-actions">
                                <button className="cancel-reply-btn" onClick={() => setReplyingToId(null)}>Batal</button>
                                <button
                                    className="post-comment-btn small"
                                    disabled={!newComment.trim()}
                                    onClick={() => handleAddComment(comment.id)}
                                >
                                    Balas
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="replies-wrapper">
                    {comment.replies.map((reply: any) => renderComment(reply, true))}
                </div>
            )}
        </div>
    );

    return (
        <div className="detail-page">
            <PageHeader
                backTo={backLink}
                title={categoryData.judul}
            />

            <div className="detail-hero">
                <h1 className="detail-title">{item.title}</h1>
                <p className="detail-subtitle">{item.description}</p>
            </div>

            <section className="video-section">
                <h2 className="section-title">
                    Video Tutorial
                </h2>
                {videoId ? (
                    <div className="video-container">
                        <iframe src={`https://www.youtube.com/embed/${videoId}`} title={item.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                ) : (
                    <div className="video-placeholder">
                        <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">
                            Tonton Video
                        </a>
                    </div>
                )}
            </section>

            {/* Tab Navigation */}
            <div className="detail-tabs">
                <button
                    className={`tab-button ${activeTab === 'detail' ? 'active' : ''}`}
                    onClick={() => setActiveTab('detail')}
                >
                    <BookOpen size={18} /> Penjelasan
                </button>
                <button
                    className={`tab-button ${activeTab === 'discussion' ? 'active' : ''}`}
                    onClick={() => setActiveTab('discussion')}
                >
                    <MessageSquare size={18} /> Diskusi ({comments.length})
                </button>
            </div>

            <section className="content-section">
                {activeTab === 'detail' ? (
                    <>
                        <h2 className="section-title-hidden">Penjelasan Detail</h2>
                        <div className="content-body animate-fade-in" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                            {item.detailedContent.split('\n').map((line: string, i: number) => {
                                if (line.startsWith('## ')) return <h2 key={i} className="content-h2">{line.replace('## ', '')}</h2>;
                                if (line.startsWith('### ')) return <h3 key={i} className="content-h3">{line.replace('### ', '')}</h3>;
                                if (line.startsWith('- ')) return <li key={i} className="content-li">{line.replace('- ', '')}</li>;
                                if (line.match(/^\d+\./)) return <li key={i} className="content-li">{line}</li>;
                                if (line.trim() === '') return <br key={i} />;
                                return <p key={i} className="content-p">{line}</p>;
                            })}
                        </div>
                    </>
                ) : (
                    <div className="discussion-section animate-fade-in">
                        {/* Show login prompt if not authenticated */}
                        {!isAuthenticated ? (
                            <div className="login-prompt">
                                <div className="login-prompt-icon">
                                    <LogIn size={48} />
                                </div>
                                <h3 className="login-prompt-title">Login untuk Berdiskusi</h3>
                                <p className="login-prompt-text">
                                    Silakan login terlebih dahulu untuk dapat mengirim komentar dan berinteraksi dalam diskusi.
                                </p>
                                <button 
                                    className="login-prompt-button"
                                    onClick={() => navigate('/login')}
                                >
                                    <LogIn size={18} />
                                    Login Sekarang
                                </button>
                            </div>
                        ) : (
                            <div className="comment-input-area">
                                <textarea
                                    placeholder="Tulis pertanyaan atau tanggapan Anda..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="comment-input"
                                    rows={3}
                                />
                                <button
                                    className="post-comment-btn"
                                    onClick={() => handleAddComment()}
                                    disabled={!newComment.trim()}
                                >
                                    Kirim Komentar
                                </button>
                            </div>
                        )}

                        {/* Comments List - Always visible */}
                        <div className="comments-list">
                            {comments.length > 0 ? (
                                comments.map(c => renderComment(c))
                            ) : (
                                <div className="no-comments">
                                    <MessageSquare size={48} />
                                    <p>Belum ada komentar. {isAuthenticated ? 'Jadilah yang pertama berkomentar!' : 'Login untuk memulai diskusi.'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            <footer className="detail-footer">
                <Link to={backLink} className="footer-button">
                    <ArrowLeft size={18} /> Kembali ke Roadmap
                </Link>
            </footer>
        </div>
    );
};