// src/components/admin/AnggotaModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import './AnggotaModal.css';

interface AnggotaModalProps {
    isOpen: boolean;
    isEditing: boolean;
    form: {
        nama: string;
        peran: string;
        angkatan: string;
        spesialisasi: string;
    };
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (field: string, value: string) => void;
}

export const AnggotaModal: React.FC<AnggotaModalProps> = ({
    isOpen,
    isEditing,
    form,
    onClose,
    onSubmit,
    onChange
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">
                        {isEditing ? 'Edit Anggota' : 'Tambah Anggota Baru'}
                    </h3>
                    <button onClick={onClose} className="btn-close">
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>
                
                <form onSubmit={onSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Nama Lengkap</label>
                        <input
                            className="form-input"
                            placeholder="Masukkan nama lengkap"
                            value={form.nama}
                            onChange={e => onChange('nama', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Peran</label>
                        <select
                            className="form-select"
                            value={form.peran}
                            onChange={e => onChange('peran', e.target.value)}
                        >
                            <option value="Anggota">Anggota</option>
                            <option value="Pelatih">Pelatih</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Angkatan</label>
                        <input
                            className="form-input"
                            placeholder="Contoh: 2023"
                            value={form.angkatan}
                            onChange={e => onChange('angkatan', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Spesialisasi</label>
                        <select
                            className="form-select"
                            value={form.spesialisasi}
                            onChange={e => onChange('spesialisasi', e.target.value)}
                        >
                            <option value="Tanding">Tanding</option>
                            <option value="Seni">Seni</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit">
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Anggota'}
                        </button>
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};