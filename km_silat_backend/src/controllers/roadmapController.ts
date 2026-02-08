import type { Request, Response } from 'express';
import prisma from '../lib/prisma';

// === Categories ===
export const getCategories = async (req: Request, res: Response) => {
    console.log('API: getCategories called');
    try {
        console.log('DB: Fetching kategoriRoadmap...');
        const categories = await prisma.kategoriRoadmap.findMany({
            include: { items: true }
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

export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await prisma.kategoriRoadmap.create({ data: req.body });
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Error creating category' });
    }
};

// === Items ===
export const getItemsByCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    if (typeof categoryId !== 'string') {
        res.status(400).json({ message: 'Invalid category ID' });
        return;
    }
    try {
        const items = await prisma.itemRoadmap.findMany({
            where: { kategoriRoadmapId: categoryId }
        });
        res.json(items);
    } catch (error) {
        console.error('Error fetching items by category:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
};

export const getItemDetail = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string') {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }
    try {
        const item = await prisma.itemRoadmap.findUnique({
            where: { id },
            include: { komentar: true }
        });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        console.error('Error fetching item detail:', error);
        res.status(500).json({ message: 'Error fetching item detail' });
    }
};

export const createItem = async (req: Request, res: Response) => {
    try {
        const item = await prisma.itemRoadmap.create({ data: req.body });
        res.status(201).json(item);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ message: 'Error creating item' });
    }
};

export const updateItem = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string') {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    try {
        // Remove id from body if it exists to prevent updating the primary key
        const { id: _, ...updateData } = req.body;

        const item = await prisma.itemRoadmap.update({
            where: { id },
            data: updateData
        });
        res.json(item);
    } catch (error: any) {
        console.error('Error updating item:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Item not found' });
        } else {
            res.status(500).json({ message: 'Error updating item' });
        }
    }
};

export const deleteItem = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string') {
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
            res.status(500).json({ message: 'Error deleting item' });
        }
    }
};

// === Comments ===
export const getCommentsByItem = async (req: Request, res: Response) => {
    const { itemId } = req.params;
    try {
        const comments = await prisma.komentar.findMany({
            where: {
                itemRoadmapId: String(itemId),
                parentId: null // Only get top-level comments initially
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

    if (!isi) {
        res.status(400).json({ message: 'Isi komentar tidak boleh kosong' });
        return;
    }

    try {
        const comment = await prisma.komentar.create({
            data: {
                isi,
                namaPengguna: namaPengguna || 'Anonymous',
                avatarPengguna: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(namaPengguna || 'Anonymous')}`,
                itemRoadmapId: String(itemId),
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
    try {
        await prisma.komentar.delete({
            where: { id: String(id) }
        });
        res.json({ message: 'Komentar dihapus' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Gagal menghapus komentar' });
    }
};

export const toggleLikeComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const comment = await prisma.komentar.findUnique({
            where: { id: String(id) }
        });

        if (!comment) return res.status(404).json({ message: 'Komentar tidak ditemukan' });

        const updatedComment = await prisma.komentar.update({
            where: { id: String(id) },
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