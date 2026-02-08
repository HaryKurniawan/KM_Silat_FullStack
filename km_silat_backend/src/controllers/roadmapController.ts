import type { Request, Response } from 'express';
import prisma from '../lib/prisma';

// === Categories ===
export const getCategories = async (req: Request, res: Response) => {
    console.log('API: getCategories called');
    try {
        console.log('DB: Fetching kategoriRoadmap...');
        const categories = await prisma.kategoriRoadmap.findMany({
            include: { 
                items: true,
                subCategories: {
                    include: {
                        items: true
                    }
                }
            },
            where: {
                parentId: null // Only get root categories
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        console.log(`DB: Successfully fetched ${categories.length} categories`);
        res.json(categories);
    } catch (error: any) {
        console.error('API Error in getCategories:', error);
        res.status(500).json({
            message: 'Error fetching categories',
            error: error.message,
            stack: error.stack
        });
    }
};

export const getSubCategories = async (req: Request, res: Response) => {
    const { parentSlug } = req.params;
    
    // Type guard - ensure parentSlug is string
    if (typeof parentSlug !== 'string' || !parentSlug) {
        res.status(400).json({ message: 'Invalid parent slug' });
        return;
    }
    
    try {
        // Find parent category by slug
        const parent = await prisma.kategoriRoadmap.findFirst({
            where: { 
                slug: parentSlug  // Now TypeScript knows parentSlug is string
            }
        });

        if (!parent) {
            res.status(404).json({ message: 'Parent category not found' });
            return;
        }

        // Get subcategories
        const subCategories = await prisma.kategoriRoadmap.findMany({
            where: { parentId: parent.id },
            include: { items: true },
            orderBy: { createdAt: 'asc' }
        });

        res.json(subCategories);
    } catch (error: any) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ message: 'Error fetching subcategories' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { judul, subjudul, deskripsi, warnaAksen, slug, ikon, parentId } = req.body;

        // Validate required fields
        if (!judul || !subjudul || !deskripsi || !warnaAksen || !slug) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        // Check if slug already exists
        const existing = await prisma.kategoriRoadmap.findUnique({
            where: { slug }
        });

        if (existing) {
            res.status(400).json({ message: 'Slug already exists' });
            return;
        }

        const category = await prisma.kategoriRoadmap.create({ 
            data: {
                judul,
                subjudul,
                deskripsi,
                warnaAksen,
                slug,
                ikon: ikon || null,
                parentId: parentId || null
            }
        });
        
        res.status(201).json(category);
    } catch (error: any) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string' || !id) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    try {
        const { judul, subjudul, deskripsi, warnaAksen, slug, ikon, parentId } = req.body;

        // Validate required fields
        if (!judul || !subjudul || !deskripsi || !warnaAksen || !slug) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        // Check if new slug conflicts with existing (excluding current category)
        const existing = await prisma.kategoriRoadmap.findFirst({
            where: { 
                slug,
                NOT: { id }
            }
        });

        if (existing) {
            res.status(400).json({ message: 'Slug already exists' });
            return;
        }

        const category = await prisma.kategoriRoadmap.update({
            where: { id },
            data: {
                judul,
                subjudul,
                deskripsi,
                warnaAksen,
                slug,
                ikon: ikon || null,
                parentId: parentId || null
            }
        });

        res.json(category);
    } catch (error: any) {
        console.error('Error updating category:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(500).json({ message: 'Error updating category', error: error.message });
        }
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string' || !id) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    try {
        await prisma.kategoriRoadmap.delete({
            where: { id }
        });
        res.json({ message: 'Category deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting category:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(500).json({ message: 'Error deleting category', error: error.message });
        }
    }
};

// === Items ===
export const getItemsByCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    if (typeof categoryId !== 'string' || !categoryId) {
        res.status(400).json({ message: 'Invalid category ID' });
        return;
    }
    
    try {
        // Try to find by ID first
        let items = await prisma.itemRoadmap.findMany({
            where: { kategoriRoadmapId: categoryId },
            orderBy: { createdAt: 'asc' }
        });

        // If no items found, try to find by slug
        if (items.length === 0) {
            const category = await prisma.kategoriRoadmap.findFirst({
                where: { slug: categoryId }
            });

            if (category) {
                items = await prisma.itemRoadmap.findMany({
                    where: { kategoriRoadmapId: category.id },
                    orderBy: { createdAt: 'asc' }
                });
            }
        }

        res.json(items);
    } catch (error) {
        console.error('Error fetching items by category:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
};

export const getItemDetail = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string' || !id) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }
    
    try {
        const item = await prisma.itemRoadmap.findUnique({
            where: { id },
            include: { 
                komentar: {
                    where: { parentId: null },
                    include: {
                        replies: {
                            orderBy: { createdAt: 'asc' }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        
        if (!item) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        
        res.json(item);
    } catch (error) {
        console.error('Error fetching item detail:', error);
        res.status(500).json({ message: 'Error fetching item detail' });
    }
};

export const createItem = async (req: Request, res: Response) => {
    try {
        const { id, judul, deskripsi, label, videoUrl, tipeVideo, kontenDetail, ikon, kategoriRoadmapId } = req.body;

        // Validate required fields
        if (!id || !judul || !deskripsi || !label || !kategoriRoadmapId) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const item = await prisma.itemRoadmap.create({ 
            data: {
                id,
                judul,
                deskripsi,
                label,
                videoUrl: videoUrl || '',
                tipeVideo: tipeVideo || 'youtube',
                kontenDetail: kontenDetail || '',
                ikon: ikon || 'star',
                kategoriRoadmapId
            }
        });
        
        res.status(201).json(item);
    } catch (error: any) {
        console.error('Error creating item:', error);
        res.status(500).json({ message: 'Error creating item', error: error.message });
    }
};

export const updateItem = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string' || !id) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    try {
        const { judul, deskripsi, label, videoUrl, tipeVideo, kontenDetail, ikon, kategoriRoadmapId } = req.body;

        // Validate required fields
        if (!judul || !deskripsi || !label || !kategoriRoadmapId) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const item = await prisma.itemRoadmap.update({
            where: { id },
            data: {
                judul,
                deskripsi,
                label,
                videoUrl: videoUrl || '',
                tipeVideo: tipeVideo || 'youtube',
                kontenDetail: kontenDetail || '',
                ikon: ikon || 'star',
                kategoriRoadmapId
            }
        });
        
        res.json(item);
    } catch (error: any) {
        console.error('Error updating item:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Item not found' });
        } else {
            res.status(500).json({ message: 'Error updating item', error: error.message });
        }
    }
};

export const deleteItem = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string' || !id) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    try {
        await prisma.itemRoadmap.delete({
            where: { id }
        });
        res.json({ message: 'Item deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting item:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Item not found' });
        } else {
            res.status(500).json({ message: 'Error deleting item', error: error.message });
        }
    }
};

// === Comments ===
export const getCommentsByItem = async (req: Request, res: Response) => {
    const { itemId } = req.params;
    
    if (typeof itemId !== 'string' || !itemId) {
        res.status(400).json({ message: 'Invalid item ID' });
        return;
    }
    
    try {
        const comments = await prisma.komentar.findMany({
            where: {
                itemRoadmapId: itemId,
                parentId: null
            },
            include: {
                replies: {
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
};

export const createComment = async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const { isi, namaPengguna, parentId } = req.body;

    if (typeof itemId !== 'string' || !itemId) {
        res.status(400).json({ message: 'Invalid item ID' });
        return;
    }

    if (!isi || typeof isi !== 'string') {
        res.status(400).json({ message: 'Isi komentar tidak boleh kosong' });
        return;
    }

    try {
        const comment = await prisma.komentar.create({
            data: {
                isi,
                namaPengguna: namaPengguna || 'Anonymous',
                avatarPengguna: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(namaPengguna || 'Anonymous')}`,
                itemRoadmapId: itemId,
                parentId: parentId || null
            }
        });
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Gagal membuat komentar' });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (typeof id !== 'string' || !id) {
        res.status(400).json({ message: 'Invalid comment ID' });
        return;
    }
    
    try {
        await prisma.komentar.delete({
            where: { id }
        });
        res.json({ message: 'Komentar dihapus' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Gagal menghapus komentar' });
    }
};

export const toggleLikeComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (typeof id !== 'string' || !id) {
        res.status(400).json({ message: 'Invalid comment ID' });
        return;
    }
    
    try {
        const comment = await prisma.komentar.findUnique({
            where: { id }
        });

        if (!comment) {
            res.status(404).json({ message: 'Komentar tidak ditemukan' });
            return;
        }

        const updatedComment = await prisma.komentar.update({
            where: { id },
            data: {
                suka: comment.disukai ? { decrement: 1 } : { increment: 1 },
                disukai: !comment.disukai
            }
        });

        res.json(updatedComment);
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Gagal menyukai komentar' });
    }
};