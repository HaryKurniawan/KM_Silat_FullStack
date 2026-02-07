import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.pengguna.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Gagal mengambil data pengguna' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { username, password, role = 'USER' } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    try {
        // Check if username already exists
        const existingUser = await prisma.pengguna.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username sudah digunakan' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.pengguna.create({
            data: {
                username,
                password: hashedPassword,
                role,
            },
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Gagal membuat pengguna' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    // Ensure id is a string (handle Express param type)
    const userId = Array.isArray(id) ? id[0] : id;

    if (!userId) {
        return res.status(400).json({ message: 'ID pengguna tidak valid' });
    }

    try {
        // Check if user exists
        const existingUser = await prisma.pengguna.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }

        // Check username uniqueness if changed
        if (username && username !== existingUser.username) {
            const usernameTaken = await prisma.pengguna.findUnique({
                where: { username },
            });

            if (usernameTaken) {
                return res.status(400).json({ message: 'Username sudah digunakan' });
            }
        }

        // Prepare update data
        const updateData: any = {};
        if (username) updateData.username = username;
        if (role) updateData.role = role;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.pengguna.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Gagal mengupdate pengguna' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Ensure id is a string (handle Express param type)
    const userId = Array.isArray(id) ? id[0] : id;

    if (!userId) {
        return res.status(400).json({ message: 'ID pengguna tidak valid' });
    }

    try {
        // Check if user exists
        const existingUser = await prisma.pengguna.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }

        // Prevent deleting yourself (optional safety check)
        const requestUserId = (req as any).user?.id;
        if (requestUserId === userId) {
            return res.status(400).json({ message: 'Tidak dapat menghapus akun sendiri' });
        }

        await prisma.pengguna.delete({
            where: { id: userId },
        });

        res.json({ message: 'Pengguna berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Gagal menghapus pengguna' });
    }
};