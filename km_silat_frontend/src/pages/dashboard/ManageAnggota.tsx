import React, { useState, useEffect } from 'react';
import { anggotaService } from '../../services/api';
import { Trash2, Edit2, Plus, Trophy, X, ChevronDown, ChevronUp } from 'lucide-react';

export const ManageAnggota = () => {
    const [anggotaList, setAnggotaList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ nama: '', peran: 'Anggota', angkatan: '', spesialisasi: 'Tanding' });
    const [isEditing, setIsEditing] = useState<string | null>(null);

    // Championship (Kejuaraan) State
    const [showKejuaraanForm, setShowKejuaraanForm] = useState<string | null>(null); // anggotaId
    const [editingKejuaraanId, setEditingKejuaraanId] = useState<string | null>(null);
    const [kejuaraanForm, setKejuaraanForm] = useState({ nama: '', tahun: new Date().getFullYear().toString(), prestasi: 'Juara 1' });
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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

    useEffect(() => {
        fetchAnggota();
    }, []);

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedRows(newExpanded);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await anggotaService.update(isEditing, form);
            } else {
                await anggotaService.create(form);
            }
            setForm({ nama: '', peran: 'Anggota', angkatan: '', spesialisasi: 'Tanding' });
            setIsEditing(null);
            fetchAnggota();
        } catch (err) {
            console.error(err);
        }
    };

    const handleKejuaraanSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingKejuaraanId) {
                await anggotaService.updateKejuaraan(editingKejuaraanId, kejuaraanForm);
            } else if (showKejuaraanForm) {
                await anggotaService.addKejuaraan(showKejuaraanForm, kejuaraanForm);
            }
            setKejuaraanForm({ nama: '', tahun: new Date().getFullYear().toString(), prestasi: 'Juara 1' });
            setShowKejuaraanForm(null);
            setEditingKejuaraanId(null);
            fetchAnggota();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Hapus anggota ini?')) {
            await anggotaService.delete(id);
            fetchAnggota();
        }
    };

    const handleEdit = (anggota: any) => {
        setForm({ nama: anggota.nama, peran: anggota.peran, angkatan: anggota.angkatan, spesialisasi: anggota.spesialisasi });
        setIsEditing(anggota.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEditKejuaraan = (k: any) => {
        setKejuaraanForm({ nama: k.nama, tahun: k.tahun.toString(), prestasi: k.prestasi });
        setEditingKejuaraanId(k.id);
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

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Manajemen Anggota</h1>

            <form onSubmit={handleSubmit} style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#fbbf24', fontSize: '1rem' }}>{isEditing ? 'Edit Anggota' : 'Tambah Anggota Baru'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <input
                        placeholder="Nama"
                        value={form.nama}
                        onChange={e => setForm({ ...form, nama: e.target.value })}
                        style={{ padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                        required
                    />
                    <select
                        value={form.peran}
                        onChange={e => setForm({ ...form, peran: e.target.value })}
                        style={{ padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                    >
                        <option value="Anggota">Anggota</option>
                        <option value="Pelatih">Pelatih</option>
                    </select>
                    <input
                        placeholder="Angkatan (Tahun)"
                        value={form.angkatan}
                        onChange={e => setForm({ ...form, angkatan: e.target.value })}
                        style={{ padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                        required
                    />
                    <select
                        value={form.spesialisasi}
                        onChange={e => setForm({ ...form, spesialisasi: e.target.value })}
                        style={{ padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                    >
                        <option value="Tanding">Tanding</option>
                        <option value="Seni">Seni</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#fbbf24', color: '#111827', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Plus size={18} style={{ marginRight: '0.5rem' }} />
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Anggota'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={() => { setIsEditing(null); setForm({ nama: '', peran: 'Anggota', angkatan: '', spesialisasi: 'Tanding' }); }} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}>
                            Batal
                        </button>
                    )}
                </div>
            </form>

            {loading ? <p>Loading...</p> : (
                <div style={{ overflowX: 'auto', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '1rem', width: '40px' }}></th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Nama</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Peran</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Angkatan</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Spesialisasi</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {anggotaList.map((a) => (
                                <React.Fragment key={a.id}>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <button onClick={() => toggleRow(a.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                {expandedRows.has(a.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{a.nama}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{a.peran}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{a.angkatan}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                background: a.spesialisasi === 'Tanding' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                                                color: a.spesialisasi === 'Tanding' ? '#4ade80' : '#fbbf24',
                                                border: `1px solid ${a.spesialisasi === 'Tanding' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`
                                            }}>
                                                {a.spesialisasi}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.75rem' }}>
                                            <button onClick={() => { setShowKejuaraanForm(a.id); setEditingKejuaraanId(null); setKejuaraanForm({ nama: '', tahun: new Date().getFullYear().toString(), prestasi: 'Juara 1' }); }} title="Tambah Kejuaraan" style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Trophy size={18} /></button>
                                            <button onClick={() => handleEdit(a)} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(a.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                    {expandedRows.has(a.id) && (
                                        <tr>
                                            <td colSpan={6} style={{ padding: '1rem 2rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                                                <div style={{ padding: '1rem', borderLeft: '2px solid #fbbf24' }}>
                                                    <h4 style={{ color: '#fbbf24', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Daftar Kejuaraan</h4>
                                                    {a.kejuaraan && a.kejuaraan.length > 0 ? (
                                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                            {a.kejuaraan.map((k: any) => (
                                                                <li key={k.id} style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <div>
                                                                        <span style={{ color: 'var(--text-primary)' }}>{k.nama} ({k.tahun})</span>
                                                                        <span style={{ marginLeft: '1rem', fontWeight: '600', color: '#fbbf24' }}>{k.prestasi}</span>
                                                                    </div>
                                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                        <button onClick={() => handleEditKejuaraan(k)} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer' }}><Edit2 size={14} /></button>
                                                                        <button onClick={() => handleDeleteKejuaraan(k.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Belum ada data kejuaraan.</p>}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Tambah/Edit Kejuaraan */}
            {(showKejuaraanForm || editingKejuaraanId) && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: '#fbbf24' }}>{editingKejuaraanId ? 'Edit Kejuaraan' : 'Tambah Kejuaraan'}</h3>
                            <button onClick={() => { setShowKejuaraanForm(null); setEditingKejuaraanId(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleKejuaraanSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Nama Kejuaraan</label>
                                <input placeholder="Contoh: Kejurnas Silat 2023" value={kejuaraanForm.nama} onChange={e => setKejuaraanForm({ ...kejuaraanForm, nama: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }} required />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Tahun</label>
                                <input type="number" value={kejuaraanForm.tahun} onChange={e => setKejuaraanForm({ ...kejuaraanForm, tahun: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }} required />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Prestasi</label>
                                <select value={kejuaraanForm.prestasi} onChange={e => setKejuaraanForm({ ...kejuaraanForm, prestasi: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}>
                                    <option value="Juara 1">Juara 1</option>
                                    <option value="Juara 2">Juara 2</option>
                                    <option value="Juara 3">Juara 3</option>
                                    <option value="Partisipasi">Partisipasi</option>
                                </select>
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#fbbf24', color: '#111827', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                {editingKejuaraanId ? 'Simpan Perubahan' : 'Tambah Kejuaraan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
"SAME%"

