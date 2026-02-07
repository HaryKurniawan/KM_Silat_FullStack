
import type { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [totalAnggota, totalMateri] = await Promise.all([
            prisma.anggota.count(),
            prisma.itemRoadmap.count(),
        ]);

        res.json({
            totalAnggota,
            totalMateri,
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil statistik dashboard' });
    }
};
