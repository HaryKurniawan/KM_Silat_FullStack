import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    console.log('Login attempt:', { username }); // Debug log

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    try {
        // Find user
        const user = await prisma.pengguna.findUnique({
            where: { username },
        });

        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Prepare user data (without password)
        const userData = {
            id: user.id,
            username: user.username,
            role: user.role,
        };

        console.log('Login successful:', userData); // Debug log

        // Return token and user data
        res.json({
            token,
            user: userData,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat login' });
    }
};