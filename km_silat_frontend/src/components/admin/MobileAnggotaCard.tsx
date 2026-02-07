// src/components/admin/MobileAnggotaCard.tsx
import React from 'react';
import { Award, Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import './MobileAnggotaCard.css';

interface Championship {
    id: string;
    nama: string;
    tahun: number;
    prestasi: string;
}

interface MobileAnggotaCardProps {
    anggota: {
        id: string;
        nama: string;
        peran: string;
        angkatan: string;
        spesialisasi: string;
        kejuaraan: Championship[];
    };
    isExpanded: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onAddKejuaraan: () => void;
    onEditKejuaraan: (k: Championship) => void;
    onDeleteKejuaraan: (id: string) => void;
}

export const MobileAnggotaCard: React.FC<MobileAnggotaCardProps> = ({
    anggota,
    isExpanded,
    onToggle,
    onEdit,
    onDelete,
    onAddKejuaraan,
    onEditKejuaraan,
    onDeleteKejuaraan
}) => {
    const kejuaraanCount = anggota.kejuaraan?.length || 0;

    return (
        <div className="mobile-card">
            {/* Header Section */}
            <div className="mobile-card-header">
                <div className="mobile-card-info">
                    <h3 className="mobile-card-name">{anggota.nama}</h3>
                    <div className="mobile-card-meta">
                        <span className="meta-item">{anggota.peran}</span>
                        <span className="meta-divider">•</span>
                        <span className="meta-item">Angkatan {anggota.angkatan}</span>
                    </div>
                </div>
                <span className={`specialty-badge ${anggota.spesialisasi.toLowerCase()}`}>
                    {anggota.spesialisasi}
                </span>
            </div>

            {/* Stats Section */}
            <div className="mobile-card-stats">
                <div className="stat-item">
                    <span className="stat-label">Kejuaraan</span>
                    <span className="stat-value">{kejuaraanCount}</span>
                </div>
                <button 
                    className="stat-toggle"
                    onClick={onToggle}
                >
                    <span>{isExpanded ? 'Tutup' : 'Lihat Detail'}</span>
                    {isExpanded ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
                </button>
            </div>

            {/* Action Buttons */}
            <div className="mobile-card-actions">
                <button onClick={onAddKejuaraan} className="action-btn" title="Tambah Kejuaraan">
                    <Award size={18} strokeWidth={1.5} />
                </button>
                <button onClick={onEdit} className="action-btn" title="Edit">
                    <Edit3 size={18} strokeWidth={1.5} />
                </button>
                <button onClick={onDelete} className="action-btn danger" title="Hapus">
                    <Trash2 size={18} strokeWidth={1.5} />
                </button>
            </div>

            {/* Championship List - Collapsible */}
            {isExpanded && (
                <div className="mobile-card-championships">
                    <h4 className="championships-title">Riwayat Kejuaraan</h4>
                    {kejuaraanCount > 0 ? (
                        <div className="championships-list">
                            {anggota.kejuaraan.map((k) => (
                                <div key={k.id} className="championship-card">
                                    <div className="championship-main">
                                        <div className="championship-info">
                                            <p className="championship-name">{k.nama}</p>
                                            <div className="championship-meta">
                                                <span className="championship-year">{k.tahun}</span>
                                                <span className="championship-achievement">{k.prestasi}</span>
                                            </div>
                                        </div>
                                        <div className="championship-actions">
                                            <button onClick={() => onEditKejuaraan(k)} className="action-btn-sm">
                                                <Edit3 size={14} strokeWidth={1.5} />
                                            </button>
                                            <button onClick={() => onDeleteKejuaraan(k.id)} className="action-btn-sm danger">
                                                <Trash2 size={14} strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-championships">Belum ada data kejuaraan</p>
                    )}
                </div>
            )}
        </div>
    );
};