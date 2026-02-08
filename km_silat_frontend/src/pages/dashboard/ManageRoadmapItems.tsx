import { useState, useEffect } from 'react';
import { roadmapService } from '../../services/api';
import { Plus, Pencil, Trash2, X, FolderTree, FileText, ChevronRight } from 'lucide-react';

interface Category {
    id: string;
    judul: string;
    subjudul: string;
    deskripsi: string;
    warnaAksen: string;
    slug: string;
    ikon?: string;
    parentId?: string | null;
    subCategories?: Category[];
}

export const ManageRoadmapItems = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [items, setItems] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');

    // Category Form
    const [categoryForm, setCategoryForm] = useState({
        id: '',
        judul: '',
        subjudul: '',
        deskripsi: '',
        warnaAksen: '#fbbf24',
        slug: '',
        ikon: 'folder',
        parentId: ''
    });
    const [isCategoryEditing, setIsCategoryEditing] = useState(false);

    // Item Form
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
        loadCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            loadItems();
        }
    }, [selectedCategory]);

    const loadCategories = async () => {
        try {
            const res = await roadmapService.getCategories();
            setCategories(res.data);
            
            // Auto-select first available category
            const allCategories = getAllSelectableCategories(res.data);
            if (allCategories.length > 0 && !selectedCategory) {
                setSelectedCategory(allCategories[0].id);
            }
        } catch (err) {
            console.error('Failed to load categories', err);
        }
    };

    const loadItems = async () => {
        if (selectedCategory) {
            try {
                const res = await roadmapService.getItemsByCategory(selectedCategory);
                setItems(res.data);
            } catch (err) {
                console.error('Failed to load items', err);
            }
        }
    };

    // Get all categories that can have items (including subcategories)
    const getAllSelectableCategories = (cats: Category[]): Category[] => {
        const result: Category[] = [];
        cats.forEach(cat => {
            result.push(cat);
            if (cat.subCategories && cat.subCategories.length > 0) {
                result.push(...getAllSelectableCategories(cat.subCategories));
            }
        });
        return result;
    };

    // === ITEM CRUD ===
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const itemData = { ...form, kategoriRoadmapId: selectedCategory };
            
            if (isEditing && editingId) {
                await roadmapService.updateItem(editingId, itemData);
            } else {
                if (!itemData.id) {
                    itemData.id = itemData.judul.toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '');
                }
                await roadmapService.createItem(itemData);
            }

            await loadItems();
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

    // === CATEGORY CRUD ===
    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const categoryData = {
                ...categoryForm,
                parentId: categoryForm.parentId || null
            };

            if (isCategoryEditing) {
                await roadmapService.updateCategory(categoryForm.id, categoryData);
            } else {
                await roadmapService.createCategory(categoryData);
            }

            await loadCategories();
            resetCategoryForm();
        } catch (err) {
            console.error(err);
            alert(isCategoryEditing ? 'Gagal mengupdate kategori' : 'Gagal menambah kategori');
        }
    };

    const handleCategoryEdit = (category: Category) => {
        setCategoryForm({
            id: category.id,
            judul: category.judul,
            subjudul: category.subjudul,
            deskripsi: category.deskripsi,
            warnaAksen: category.warnaAksen,
            slug: category.slug,
            ikon: category.ikon || 'folder',
            parentId: category.parentId || ''
        });
        setIsCategoryEditing(true);
        setActiveTab('categories');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus kategori ini? Semua item di dalamnya akan ikut terhapus!')) return;
        
        try {
            await roadmapService.deleteCategory(id);
            await loadCategories();
            if (selectedCategory === id) {
                setSelectedCategory('');
            }
        } catch (err) {
            console.error(err);
            alert('Gagal menghapus kategori');
        }
    };

    const resetCategoryForm = () => {
        setCategoryForm({
            id: '',
            judul: '',
            subjudul: '',
            deskripsi: '',
            warnaAksen: '#fbbf24',
            slug: '',
            ikon: 'folder',
            parentId: ''
        });
        setIsCategoryEditing(false);
    };

    // Auto-generate slug from title
    const handleTitleChange = (value: string, isCategory: boolean = false) => {
        const slug = value.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        
        if (isCategory) {
            setCategoryForm({ ...categoryForm, judul: value, slug });
        }
    };

    // Render category tree
    const renderCategoryTree = (cats: Category[], level: number = 0) => {
        return cats.map(cat => (
            <div key={cat.id} style={{ marginLeft: `${level * 1.5}rem` }}>
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '1rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            {level > 0 && <ChevronRight size={16} color="var(--text-secondary)" />}
                            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>
                                {cat.judul}
                            </h4>
                            <span style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-secondary)',
                                background: 'var(--bg-secondary)',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px'
                            }}>
                                /{cat.slug}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {cat.subjudul}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => handleCategoryEdit(cat)}
                            style={{
                                padding: '0.4rem 0.8rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleCategoryDelete(cat.id)}
                            style={{
                                padding: '0.4rem 0.8rem',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            Hapus
                        </button>
                    </div>
                </div>
                {cat.subCategories && cat.subCategories.length > 0 && renderCategoryTree(cat.subCategories, level + 1)}
            </div>
        ));
    };

    const allSelectableCategories = getAllSelectableCategories(categories);
    const parentCategories = categories.filter(c => !c.parentId);

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                Manajemen Roadmap
            </h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)' }}>
                <button
                    onClick={() => setActiveTab('items')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'items' ? '2px solid #fbbf24' : '2px solid transparent',
                        color: activeTab === 'items' ? '#fbbf24' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '-2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <FileText size={18} /> Kelola Materi
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'categories' ? '2px solid #fbbf24' : '2px solid transparent',
                        color: activeTab === 'categories' ? '#fbbf24' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '-2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <FolderTree size={18} /> Kelola Kategori
                </button>
            </div>

            {/* ITEMS TAB */}
            {activeTab === 'items' && (
                <>
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
                                cursor: 'pointer',
                                minWidth: '300px'
                            }}
                        >
                            {allSelectableCategories.map(c => {
                                const isChild = c.parentId !== null;
                                const prefix = isChild ? '  └─ ' : '';
                                return (
                                    <option key={c.id} value={c.id}>
                                        {prefix}{c.judul} ({c.slug})
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <form onSubmit={handleSubmit} style={formContainerStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '1.2rem', fontWeight: '600' }}>
                                {isEditing ? 'Edit Materi' : 'Tambah Materi Baru'}
                            </h3>
                            {isEditing && (
                                <button type="button" onClick={resetForm} style={cancelButtonStyle}>
                                    <X size={16} /> Batal
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input 
                                    placeholder="Judul Materi" 
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
                                    placeholder="Video URL (YouTube/Vimeo)" 
                                    value={form.videoUrl} 
                                    onChange={e => setForm({ ...form, videoUrl: e.target.value })} 
                                    style={inputStyle} 
                                />
                                <input 
                                    placeholder="Icon Name (e.g. target, shield, award)" 
                                    value={form.ikon} 
                                    onChange={e => setForm({ ...form, ikon: e.target.value })} 
                                    style={inputStyle} 
                                />
                            </div>

                            <textarea 
                                placeholder="Konten Detail (Markdown supported)" 
                                value={form.kontenDetail} 
                                onChange={e => setForm({ ...form, kontenDetail: e.target.value })} 
                                style={{ ...inputStyle, minHeight: '200px', fontFamily: 'monospace' }} 
                            />
                        </div>

                        <button type="submit" style={submitButtonStyle}>
                            {isEditing ? <><Pencil size={18} /> Update Materi</> : <><Plus size={18} /> Tambah Materi</>}
                        </button>
                    </form>

                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                        Daftar Materi ({items.length})
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        {items.map(item => (
                            <div key={item.id} style={itemCardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', flex: 1 }}>
                                        {item.judul}
                                    </h4>
                                    <span style={labelStyle}>{item.label}</span>
                                </div>
                                
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                                    {item.deskripsi}
                                </p>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEdit(item)} style={editButtonStyle}>
                                        <Pencil size={16} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} style={deleteButtonStyle}>
                                        <Trash2 size={16} /> Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
                <>
                    <form onSubmit={handleCategorySubmit} style={formContainerStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '1.2rem', fontWeight: '600' }}>
                                {isCategoryEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                            </h3>
                            {isCategoryEditing && (
                                <button type="button" onClick={resetCategoryForm} style={cancelButtonStyle}>
                                    <X size={16} /> Batal
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input 
                                    placeholder="Judul Kategori (e.g. Seni, Tanding)" 
                                    value={categoryForm.judul} 
                                    onChange={e => handleTitleChange(e.target.value, true)} 
                                    style={inputStyle} 
                                    required 
                                />
                                <input 
                                    placeholder="Slug (auto-generated)" 
                                    value={categoryForm.slug} 
                                    onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })} 
                                    style={inputStyle} 
                                    required 
                                />
                            </div>

                            <input 
                                placeholder="Subjudul (e.g. Keindahan Gerak & Jurus)" 
                                value={categoryForm.subjudul} 
                                onChange={e => setCategoryForm({ ...categoryForm, subjudul: e.target.value })} 
                                style={inputStyle} 
                                required 
                            />

                            <textarea 
                                placeholder="Deskripsi kategori" 
                                value={categoryForm.deskripsi} 
                                onChange={e => setCategoryForm({ ...categoryForm, deskripsi: e.target.value })} 
                                style={{ ...inputStyle, minHeight: '100px' }} 
                                required 
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        Warna Aksen
                                    </label>
                                    <input 
                                        type="color" 
                                        value={categoryForm.warnaAksen} 
                                        onChange={e => setCategoryForm({ ...categoryForm, warnaAksen: e.target.value })} 
                                        style={{ ...inputStyle, height: '45px' }} 
                                    />
                                </div>
                                <input 
                                    placeholder="Icon (e.g. folder, award)" 
                                    value={categoryForm.ikon} 
                                    onChange={e => setCategoryForm({ ...categoryForm, ikon: e.target.value })} 
                                    style={inputStyle} 
                                />
                                <select
                                    value={categoryForm.parentId}
                                    onChange={e => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                                    style={inputStyle}
                                >
                                    <option value="">Root Category</option>
                                    {parentCategories.map(c => (
                                        <option key={c.id} value={c.id}>{c.judul}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" style={submitButtonStyle}>
                            {isCategoryEditing ? <><Pencil size={18} /> Update Kategori</> : <><Plus size={18} /> Tambah Kategori</>}
                        </button>
                    </form>

                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                        Struktur Kategori
                    </h3>

                    <div>
                        {renderCategoryTree(parentCategories)}
                    </div>
                </>
            )}
        </div>
    );
};

// Styles
const formContainerStyle = { 
    background: 'var(--bg-secondary)', 
    padding: '2rem', 
    borderRadius: 'var(--border-radius)', 
    border: '1px solid var(--border-color)', 
    marginBottom: '3rem',
    position: 'relative' as const
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

const submitButtonStyle = { 
    marginTop: '1.5rem', 
    padding: '0.75rem 1.5rem', 
    background: '#fbbf24', 
    color: '#111827', 
    border: 'none', 
    borderRadius: '4px', 
    fontWeight: 'bold' as const, 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.5rem',
    fontSize: '1rem' 
};

const cancelButtonStyle = {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
};

const itemCardStyle = { 
    background: 'var(--bg-card)', 
    padding: '1.5rem', 
    borderRadius: 'var(--border-radius)', 
    border: '1px solid var(--border-color)', 
    transition: 'transform 0.2s',
    position: 'relative' as const
};

const labelStyle = { 
    fontSize: '0.7rem', 
    textTransform: 'uppercase' as const, 
    letterSpacing: '0.05em', 
    color: '#fbbf24', 
    border: '1px solid #fbbf24', 
    padding: '0.1rem 0.4rem', 
    borderRadius: '4px',
    marginLeft: '0.5rem'
};

const editButtonStyle = {
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
};

const deleteButtonStyle = {
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
};