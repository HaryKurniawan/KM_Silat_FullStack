import { useState, useEffect } from 'react';
import { roadmapService } from '../../services/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export const ManageRoadmapItems = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [items, setItems] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({ 
        id: '', 
        judul: '', 
        deskripsi: '', 
        label: 'Teknik', 
        videoUrl: '', 
        tipeVideo: 'youtube', 
        kontenDetail: '', 
        ikon: 'star' 
    });

    useEffect(() => {
        roadmapService.getCategories().then(res => {
            setCategories(res.data);
            if (res.data.length > 0) setSelectedCategory(res.data[0].id);
        });
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            loadItems();
        }
    }, [selectedCategory]);

    const loadItems = async () => {
        if (selectedCategory) {
            const res = await roadmapService.getItemsByCategory(selectedCategory);
            setItems(res.data);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const itemData = { ...form, kategoriRoadmapId: selectedCategory };
            
            if (isEditing && editingId) {
                // Update existing item
                await roadmapService.updateItem(editingId, itemData);
            } else {
                // Create new item - generate slug if empty
                if (!itemData.id) {
                    itemData.id = itemData.judul.toLowerCase().replace(/\s+/g, '-');
                }
                await roadmapService.createItem(itemData);
            }

            // Refresh list
            await loadItems();
            
            // Reset form
            resetForm();
        } catch (err) {
            console.error(err);
            alert(isEditing ? 'Gagal mengupdate item' : 'Gagal menambah item');
        }
    };

    const handleEdit = (item: any) => {
        setForm({
            id: item.id,
            judul: item.judul,
            deskripsi: item.deskripsi,
            label: item.label,
            videoUrl: item.videoUrl,
            tipeVideo: item.tipeVideo,
            kontenDetail: item.kontenDetail,
            ikon: item.ikon
        });
        setIsEditing(true);
        setEditingId(item.id);
        
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
        
        try {
            await roadmapService.deleteItem(id);
            await loadItems();
        } catch (err) {
            console.error(err);
            alert('Gagal menghapus item');
        }
    };

    const resetForm = () => {
        setForm({ 
            id: '', 
            judul: '', 
            deskripsi: '', 
            label: 'Teknik', 
            videoUrl: '', 
            tipeVideo: 'youtube', 
            kontenDetail: '', 
            ikon: 'star' 
        });
        setIsEditing(false);
        setEditingId(null);
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                Manajemen Roadmap
            </h1>

            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Pilih Kategori:</label>
                <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    style={{ 
                        padding: '0.6rem 1rem', 
                        background: 'var(--bg-secondary)', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-primary)', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                    }}
                >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.judul}</option>)}
                </select>
            </div>

            <form 
                onSubmit={handleSubmit} 
                style={{ 
                    background: 'var(--bg-secondary)', 
                    padding: '2rem', 
                    borderRadius: 'var(--border-radius)', 
                    border: '1px solid var(--border-color)', 
                    marginBottom: '3rem',
                    position: 'relative'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '1.2rem', fontWeight: '600' }}>
                        {isEditing ? 'Edit Item' : 'Tambah Item Baru'}
                    </h3>
                    {isEditing && (
                        <button 
                            type="button" 
                            onClick={resetForm}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <X size={16} /> Batal
                        </button>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input 
                            placeholder="Judul" 
                            value={form.judul} 
                            onChange={e => setForm({ ...form, judul: e.target.value })} 
                            style={inputStyle} 
                            required 
                        />
                        <select 
                            value={form.label} 
                            onChange={e => setForm({ ...form, label: e.target.value })} 
                            style={inputStyle}
                        >
                            <option value="Teknik">Label: Teknik</option>
                            <option value="Fisik">Label: Fisik</option>
                            <option value="Tanding">Label: Tanding</option>
                            <option value="Tampil">Label: Tampil</option>
                        </select>
                    </div>

                    <input 
                        placeholder="Deskripsi Singkat" 
                        value={form.deskripsi} 
                        onChange={e => setForm({ ...form, deskripsi: e.target.value })} 
                        style={inputStyle} 
                        required 
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input 
                            placeholder="Video URL" 
                            value={form.videoUrl} 
                            onChange={e => setForm({ ...form, videoUrl: e.target.value })} 
                            style={inputStyle} 
                        />
                        <input 
                            placeholder="Icon Name (e.g. drama, users)" 
                            value={form.ikon} 
                            onChange={e => setForm({ ...form, ikon: e.target.value })} 
                            style={inputStyle} 
                        />
                    </div>

                    <textarea 
                        placeholder="Konten Detail (Markdown)" 
                        value={form.kontenDetail} 
                        onChange={e => setForm({ ...form, kontenDetail: e.target.value })} 
                        style={{ ...inputStyle, minHeight: '150px' }} 
                    />
                </div>

                <button type="submit" style={buttonStyle}>
                    {isEditing ? (
                        <>
                            <Pencil size={18} style={{ marginRight: '0.5rem' }} /> Update Item
                        </>
                    ) : (
                        <>
                            <Plus size={18} style={{ marginRight: '0.5rem' }} /> Tambah Item
                        </>
                    )}
                </button>
            </form>

            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                Daftar Item ({items.length})
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {items.map(item => (
                    <div 
                        key={item.id} 
                        style={{ 
                            background: 'var(--bg-card)', 
                            padding: '1.5rem', 
                            borderRadius: 'var(--border-radius)', 
                            border: '1px solid var(--border-color)', 
                            transition: 'transform 0.2s',
                            position: 'relative'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', flex: 1 }}>
                                {item.judul}
                            </h4>
                            <span style={{ 
                                fontSize: '0.7rem', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.05em', 
                                color: '#fbbf24', 
                                border: '1px solid #fbbf24', 
                                padding: '0.1rem 0.4rem', 
                                borderRadius: '4px',
                                marginLeft: '0.5rem'
                            }}>
                                {item.label}
                            </span>
                        </div>
                        
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                            {item.deskripsi}
                        </p>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => handleEdit(item)}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Pencil size={16} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Trash2 size={16} /> Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const inputStyle = { 
    padding: '0.75rem 1rem', 
    background: 'var(--bg-primary)', 
    border: '1px solid var(--border-color)', 
    color: 'var(--text-primary)', 
    borderRadius: '4px', 
    fontSize: '1rem', 
    width: '100%' 
};

const buttonStyle = { 
    marginTop: '1.5rem', 
    padding: '0.75rem 1.5rem', 
    background: '#fbbf24', 
    color: '#111827', 
    border: 'none', 
    borderRadius: '4px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    fontSize: '1rem' 
};