
import { useState, useEffect } from 'react';
import { roadmapService } from '../../services/api';
import { Plus } from 'lucide-react';

export const ManageRoadmapItems = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [items, setItems] = useState<any[]>([]);

    // Simplification: Form only for Items for now
    const [form, setForm] = useState({ id: '', judul: '', deskripsi: '', label: 'Teknik', videoUrl: '', tipeVideo: 'youtube', kontenDetail: '', ikon: 'star' });

    useEffect(() => {
        roadmapService.getCategories().then(res => {
            setCategories(res.data);
            if (res.data.length > 0) setSelectedCategory(res.data[0].id);
        });
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            roadmapService.getItemsByCategory(selectedCategory).then(res => setItems(res.data));
        }
    }, [selectedCategory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Need to generate slug/ID if empty or auto-generate
            const newItem = { ...form, kategoriRoadmapId: selectedCategory };
            // Simple slug generation
            if (!newItem.id) newItem.id = newItem.judul.toLowerCase().replace(/\s+/g, '-');

            await roadmapService.createItem(newItem);

            // Refresh
            const res = await roadmapService.getItemsByCategory(selectedCategory);
            setItems(res.data);
            setForm({ id: '', judul: '', deskripsi: '', label: 'Teknik', videoUrl: '', tipeVideo: 'youtube', kontenDetail: '', ikon: 'star' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Manajemen Roadmap</h1>

            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Pilih Kategori:</label>
                <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    style={{ padding: '0.6rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.judul}</option>)}
                </select>
            </div>

            <form onSubmit={handleSubmit} style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#fbbf24', fontSize: '1.2rem', fontWeight: '600' }}>Tambah Item Baru</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input placeholder="Judul" value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} style={inputStyle} required />
                        <select value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} style={inputStyle}>
                            <option value="Teknik">Label: Teknik</option>
                            <option value="Fisik">Label: Fisik</option>
                            <option value="Tanding">Label: Tanding</option>
                            <option value="Tampil">Label: Tampil</option>
                        </select>
                    </div>
                    <input placeholder="Deskripsi Singkat" value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} style={inputStyle} required />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input placeholder="Video URL" value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} style={inputStyle} />
                        <input placeholder="Icon Name (e.g. drama, users)" value={form.ikon} onChange={e => setForm({ ...form, ikon: e.target.value })} style={inputStyle} />
                    </div>
                    <textarea placeholder="Konten Detail (Markdown)" value={form.kontenDetail} onChange={e => setForm({ ...form, kontenDetail: e.target.value })} style={{ ...inputStyle, minHeight: '150px' }} />
                </div>
                <button type="submit" style={buttonStyle}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> Tambah Item
                </button>
            </form>

            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Daftar Item ({items.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {items.map(item => (
                    <div key={item.id} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', transition: 'transform 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{item.judul}</h4>
                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fbbf24', border: '1px solid #fbbf24', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{item.label}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.deskripsi}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

const inputStyle = { padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '1rem', width: '100%' };
const buttonStyle = { marginTop: '1.5rem', padding: '0.75rem 1.5rem', background: '#fbbf24', color: '#111827', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '1rem' };
