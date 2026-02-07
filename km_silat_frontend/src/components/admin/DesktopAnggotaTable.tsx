// src/components/admin/DesktopAnggotaTable.tsx
import React from 'react';
import { Award, Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Championship {
    id: string;
    nama: string;
    tahun: number;
    prestasi: string;
}

interface Anggota {
    id: string;
    nama: string;
    peran: string;
    angkatan: string;
    spesialisasi: string;
    kejuaraan: Championship[];
}

interface DesktopAnggotaTableProps {
    anggotaList: Anggota[];
    expandedRows: Set<string>;
    onToggle: (id: string) => void;
    onEdit: (anggota: Anggota) => void;
    onDelete: (id: string) => void;
    onAddKejuaraan: (anggotaId: string) => void;
    onEditKejuaraan: (k: Championship) => void;
    onDeleteKejuaraan: (id: string) => void;
}

export const DesktopAnggotaTable: React.FC<DesktopAnggotaTableProps> = ({
    anggotaList,
    expandedRows,
    onToggle,
    onEdit,
    onDelete,
    onAddKejuaraan,
    onEditKejuaraan,
    onDeleteKejuaraan
}) => {
    return (
        <div className="table-container">
            <table className="anggota-table">
                <thead>
                    <tr>
                        <th className="col-toggle"></th>
                        <th>Nama</th>
                        <th>Peran</th>
                        <th>Angkatan</th>
                        <th>Spesialisasi</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {anggotaList.map((a) => (
                        <React.Fragment key={a.id}>
                            <tr>
                                <td>
                                    <button onClick={() => onToggle(a.id)} className="btn-toggle">
                                        {expandedRows.has(a.id) ? 
                                            <ChevronUp size={16} strokeWidth={1.5} /> : 
                                            <ChevronDown size={16} strokeWidth={1.5} />
                                        }
                                    </button>
                                </td>
                                <td className="student-name">{a.nama}</td>
                                <td>{a.peran}</td>
                                <td>{a.angkatan}</td>
                                <td>
                                    <span className={`specialty-badge ${a.spesialisasi.toLowerCase()}`}>
                                        {a.spesialisasi}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            onClick={() => onAddKejuaraan(a.id)} 
                                            title="Tambah Kejuaraan" 
                                            className="btn-icon trophy"
                                        >
                                            <Award size={18} strokeWidth={1.5} />
                                        </button>
                                        <button onClick={() => onEdit(a)} className="btn-icon edit">
                                            <Edit3 size={18} strokeWidth={1.5} />
                                        </button>
                                        <button onClick={() => onDelete(a.id)} className="btn-icon delete">
                                            <Trash2 size={18} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {expandedRows.has(a.id) && (
                                <tr className="championship-row">
                                    <td colSpan={6}>
                                        <div className="championship-content">
                                            <h4 className="championship-header">Daftar Kejuaraan</h4>
                                            {a.kejuaraan && a.kejuaraan.length > 0 ? (
                                                <ul className="championship-list">
                                                    {a.kejuaraan.map((k) => (
                                                        <li key={k.id} className="championship-item">
                                                            <div className="championship-info">
                                                                <span className="championship-name">{k.nama}</span>
                                                                <span className="championship-year">({k.tahun})</span>
                                                                <span className="championship-achievement">{k.prestasi}</span>
                                                            </div>
                                                            <div className="championship-actions">
                                                                <button onClick={() => onEditKejuaraan(k)} className="btn-icon edit">
                                                                    <Edit3 size={14} strokeWidth={1.5} />
                                                                </button>
                                                                <button onClick={() => onDeleteKejuaraan(k.id)} className="btn-icon delete">
                                                                    <Trash2 size={14} strokeWidth={1.5} />
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="no-data-message">Belum ada data kejuaraan.</p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};