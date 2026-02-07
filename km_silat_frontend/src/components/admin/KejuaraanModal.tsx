// src/components/admin/KejuaraanModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import './AnggotaModal.css';

interface KejuaraanModalProps {
    isOpen: boolean;
    isEditing: boolean;
    form: {
        nama: string;
        tahun: string;
        prestasi: string;
    };
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (field: string, value: string) => void;
}

export const KejuaraanModal: React.FC<KejuaraanModalProps> = ({
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
                        {isEditing ? 'Edit Kejuaraan' : 'Tambah Kejuaraan'}
                    </h3>
                    <button onClick={onClose} className="btn-close">
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>
                
                <form onSubmit={onSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Nama Kejuaraan</label>
                        <input 
                            className="form-input"
                            placeholder="Contoh: Kejurnas Silat 2023" 
                            value={form.nama} 
                            onChange={e => onChange('nama', e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tahun</label>
                        <input 
                            className="form-input"
                            type="number" 
                            value={form.tahun} 
                            onChange={e => onChange('tahun', e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Prestasi</label>
                        <select 
                            className="form-select"
                            value={form.prestasi} 
                            onChange={e => onChange('prestasi', e.target.value)} 
                        >
                            <option value="Juara 1">Juara 1</option>
                            <option value="Juara 2">Juara 2</option>
                            <option value="Juara 3">Juara 3</option>
                            <option value="Partisipasi">Partisipasi</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-submit" style={{ width: '100%' }}>
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Kejuaraan'}
                    </button>
                </form>
            </div>
        </div>
    );
};