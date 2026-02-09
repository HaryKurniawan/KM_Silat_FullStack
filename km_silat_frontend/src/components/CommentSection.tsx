import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ThumbsUp, Send, LogIn, X, Trash2, Loader2 } from 'lucide-react';
import './CommentSection.css';

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

interface CommentSectionProps {
    comments: Comment[];
    isAuthenticated: boolean;
    username?: string;
    commentText: string;
    replyingTo: string | null;
    isSubmitting?: boolean;
    onCommentTextChange: (text: string) => void;
    onSubmitComment: (e: React.FormEvent, parentId?: string) => void;
    onLikeComment: (commentId: string) => void;
    onDeleteComment: (commentId: string) => void;
    onReplyClick: (commentId: string) => void;
    onCancelReply: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
    comments,
    isAuthenticated,
    username,
    commentText,
    replyingTo,
    isSubmitting = false,
    onCommentTextChange,
    onSubmitComment,
    onLikeComment,
    onDeleteComment,
    onReplyClick,
    onCancelReply,
}) => {
    const navigate = useNavigate();

    const handleDeleteClick = (commentId: string, commentAuthor: string) => {
        if (username === commentAuthor) {
            if (window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
                onDeleteComment(commentId);
            }
        }
    };

    const renderComment = (comment: Comment, isReply: boolean = false) => (
        <div key={comment.id} className="comment-group">
            <div className={`comment-item ${isReply ? 'is-reply' : 'is-main'}`}>
                <div className="comment-avatar">
                    {comment.namaPengguna.charAt(0).toUpperCase()}
                </div>
                <div className="comment-content-wrapper">
                    <div className="author-info">
                        <span className="comment-author">{comment.namaPengguna}</span>
                        <span className="dot-separator">•</span>
                        <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    <p className="comment-text">{comment.isi}</p>
                    <div className="comment-actions">
                        <button
                            onClick={() => onLikeComment(comment.id)}
                            className={`action-btn like-btn ${comment.disukai ? 'liked' : ''}`}
                            disabled={isSubmitting}
                        >
                            <ThumbsUp size={16} fill={comment.disukai ? 'currentColor' : 'none'} />
                            <span>{comment.suka}</span>
                        </button>
                        {!isReply && isAuthenticated && (
                            <button
                                onClick={() => onReplyClick(comment.id)}
                                className="action-btn reply-btn"
                                disabled={isSubmitting}
                            >
                                <MessageCircle size={16} />
                                <span>Balas</span>
                            </button>
                        )}
                        {isAuthenticated && username === comment.namaPengguna && (
                            <button
                                onClick={() => handleDeleteClick(comment.id, comment.namaPengguna)}
                                className="action-btn delete-btn"
                                disabled={isSubmitting}
                            >
                                <Trash2 size={16} />
                                <span>Hapus</span>
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && isAuthenticated && (
                        <div className="inline-reply-form">
                            <div className="reply-badge">
                                <span>Membalas {comment.namaPengguna}</span>
                                <button
                                    onClick={onCancelReply}
                                    className="badge-close-btn"
                                    type="button"
                                    disabled={isSubmitting}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <form onSubmit={(e) => onSubmitComment(e, comment.id)}>
                                <textarea
                                    value={commentText}
                                    onChange={(e) => onCommentTextChange(e.target.value)}
                                    placeholder="Tulis balasan..."
                                    className="comment-input inline"
                                    rows={3}
                                    required
                                    disabled={isSubmitting}
                                />
                                <div className="inline-form-actions">
                                    <button
                                        type="button"
                                        onClick={onCancelReply}
                                        className="cancel-reply-btn"
                                        disabled={isSubmitting}
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="post-comment-btn small"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={14} className="spinning" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={14} /> Kirim
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="replies-wrapper">
                    {comment.replies.map(reply => (
                        <div key={reply.id} className="reply-group">
                            {renderComment(reply, true)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="discussion-section">
            <h3 className="section-title">
                <MessageCircle size={20} />
                Diskusi ({comments.length})
            </h3>

            {/* Comment Form - Only for authenticated users */}
            {isAuthenticated ? (
                <div className="comment-input-area">
                    <div className="user-badge">
                        Berkomentar sebagai: <strong>{username}</strong>
                    </div>
                    <form onSubmit={(e) => onSubmitComment(e)}>
                        <textarea
                            value={commentText}
                            onChange={(e) => onCommentTextChange(e.target.value)}
                            placeholder="Tulis komentar..."
                            required
                            className="comment-input"
                            rows={4}
                            disabled={isSubmitting}
                        />
                        <button 
                            type="submit" 
                            className="post-comment-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="spinning" />
                                    Mengirim Komentar...
                                </>
                            ) : (
                                <>
                                    <Send size={16} /> Kirim Komentar
                                </>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="login-prompt">
                    <div className="login-prompt-icon">
                        <LogIn size={40} />
                    </div>
                    <h4 className="login-prompt-title">Login untuk Berkomentar</h4>
                    <p className="login-prompt-text">
                        Anda harus login terlebih dahulu untuk dapat berkomentar dan berinteraksi dengan komunitas.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="login-prompt-button"
                    >
                        <LogIn size={18} /> Login Sekarang
                    </button>
                </div>
            )}

            {/* Comments List */}
            {comments.length > 0 ? (
                <div className="comments-list">
                    {comments.map(comment => renderComment(comment))}
                </div>
            ) : (
                <div className="no-comments">
                    <MessageCircle size={48} />
                    <p>Belum ada komentar. Jadilah yang pertama!</p>
                </div>
            )}
        </div>
    );
};