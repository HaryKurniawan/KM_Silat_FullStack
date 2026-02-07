import React, { useState, useEffect } from 'react';
import { anggotaService } from '../../services/api';
import { UserPlus, Users } from 'lucide-react';
import { AnggotaModal } from '../../components/admin/AnggotaModal';
import { KejuaraanModal } from '../../components/admin/KejuaraanModal';
import { MobileAnggotaCard } from '../..//components/admin/MobileAnggotaCard';
import { DesktopAnggotaTable } from '../../components/admin/DesktopAnggotaTable';
import './ManageAnggota.css';

export const ManageAnggota = () => {
    const [anggotaList, setAnggotaList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Anggota Form State
    const [form, setForm] = useState({ nama: '', peran: 'Anggota', angkatan: '', spesialisasi: 'Tanding' });
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [showAnggotaModal, setShowAnggotaModal] = useState(false);

    // Kejuaraan Form State
    const [showKejuaraanModal, setShowKejuaraanModal] = useState(false);
    const [currentAnggotaId, setCurrentAnggotaId] = useState<string | null>(null);
    const [editingKejuaraanId, setEditingKejuaraanId] = useState<string | null>(null);
    const [kejuaraanForm, setKejuaraanForm] = useState({ 
        nama: '', 
        tahun: new Date().getFullYear().toString(), 
        prestasi: 'Juara 1' 
    });

    // UI State
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchAnggota();
    }, []);

    const fetchAnggota = async () => {
        try {
            const res = await anggotaService.getAll();
            setAnggotaList(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Anggota Handlers
    const handleAddNew = () => {
        setForm({ nama: '', peran: 'Anggota', angkatan: '', spesialisasi: 'Tanding' });
        setIsEditing(null);
        setShowAnggotaModal(true);
    };

    const handleEdit = (anggota: any) => {
        setForm({ 
            nama: anggota.nama, 
            peran: anggota.peran, 
            angkatan: anggota.angkatan, 
            spesialisasi: anggota.spesialisasi 
        });
        setIsEditing(anggota.id);
        setShowAnggotaModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Hapus anggota ini?')) {
            await anggotaService.delete(id);
            fetchAnggota();
        }
    };

    const handleSubmitAnggota = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await anggotaService.update(isEditing, form);
            } else {
                await anggotaService.create(form);
            }
            setShowAnggotaModal(false);
            setIsEditing(null);
            setForm({ nama: '', peran: 'Anggota', angkatan: '', spesialisasi: 'Tanding' });
            fetchAnggota();
        } catch (err) {
            console.error(err);
        }
    };

    const handleFormChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // Kejuaraan Handlers
    const handleAddKejuaraan = (anggotaId: string) => {
        setCurrentAnggotaId(anggotaId);
        setEditingKejuaraanId(null);
        setKejuaraanForm({ nama: '', tahun: new Date().getFullYear().toString(), prestasi: 'Juara 1' });
        setShowKejuaraanModal(true);
    };

    const handleEditKejuaraan = (k: any) => {
        setKejuaraanForm({ nama: k.nama, tahun: k.tahun.toString(), prestasi: k.prestasi });
        setEditingKejuaraanId(k.id);
        setShowKejuaraanModal(true);
    };

    const handleDeleteKejuaraan = async (id: string) => {
        if (confirm('Hapus data kejuaraan ini?')) {
            try {
                await anggotaService.deleteKejuaraan(id);
                fetchAnggota();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSubmitKejuaraan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingKejuaraanId) {
                await anggotaService.updateKejuaraan(editingKejuaraanId, kejuaraanForm);
            } else if (currentAnggotaId) {
                await anggotaService.addKejuaraan(currentAnggotaId, kejuaraanForm);
            }
            setShowKejuaraanModal(false);
            setCurrentAnggotaId(null);
            setEditingKejuaraanId(null);
            setKejuaraanForm({ nama: '', tahun: new Date().getFullYear().toString(), prestasi: 'Juara 1' });
            fetchAnggota();
        } catch (err) {
            console.error(err);
        }
    };

    const handleKejuaraanFormChange = (field: string, value: string) => {
        setKejuaraanForm(prev => ({ ...prev, [field]: value }));
    };

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    return (
        <div className="manage-anggota-page">
            {/* Header */}
            <div className="manage-header">
                <h1 className="manage-title">Manajemen Anggota</h1>
                <button onClick={handleAddNew} className="btn-add-primary">
                    <UserPlus size={18} strokeWidth={1.5} />
                    <span>Tambah Anggota</span>
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Memuat data...</p>
                </div>
            ) : anggotaList.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <Users size={48} />
                    </div>
                    <p className="empty-state-text">Belum ada data anggota</p>
                    <p className="empty-state-subtext">Klik tombol "Tambah Anggota" untuk memulai</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <DesktopAnggotaTable 
                        anggotaList={anggotaList}
                        expandedRows={expandedRows}
                        onToggle={toggleRow}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAddKejuaraan={handleAddKejuaraan}
                        onEditKejuaraan={handleEditKejuaraan}
                        onDeleteKejuaraan={handleDeleteKejuaraan}
                    />

                    {/* Mobile Card View */}
                    <div className="mobile-card-view">
                        {anggotaList.map((a) => (
                            <MobileAnggotaCard
                                key={a.id}
                                anggota={a}
                                isExpanded={expandedRows.has(a.id)}
                                onToggle={() => toggleRow(a.id)}
                                onEdit={() => handleEdit(a)}
                                onDelete={() => handleDelete(a.id)}
                                onAddKejuaraan={() => handleAddKejuaraan(a.id)}
                                onEditKejuaraan={handleEditKejuaraan}
                                onDeleteKejuaraan={handleDeleteKejuaraan}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Modals */}
            <AnggotaModal
                isOpen={showAnggotaModal}
                isEditing={!!isEditing}
                form={form}
                onClose={() => {
                    setShowAnggotaModal(false);
                    setIsEditing(null);
                }}
                onSubmit={handleSubmitAnggota}
                onChange={handleFormChange}
            />

            <KejuaraanModal
                isOpen={showKejuaraanModal}
                isEditing={!!editingKejuaraanId}
                form={kejuaraanForm}
                onClose={() => {
                    setShowKejuaraanModal(false);
                    setEditingKejuaraanId(null);
                    setCurrentAnggotaId(null);
                }}
                onSubmit={handleSubmitKejuaraan}
                onChange={handleKejuaraanFormChange}
            />
        </div>
    );
};