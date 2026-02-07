
import type { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getJadwal = async (req: Request, res: Response) => {
    try {
        const jadwal = await prisma.jadwal.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(jadwal);
    } catch (error) {
        console.error('Error fetching jadwal:', error);
        res.status(500).json({ message: 'Gagal mengambil jadwal latihan' });
    }
};

export const updateJadwal = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, kategori, waktu, lokasi } = req.body;

    try {
        const updated = await prisma.jadwal.update({
            where: { id: parseInt(String(id)) },
            data: { status, kategori, waktu, lokasi }
        });
        res.json(updated);
    } catch (error) {
        console.error('Error updating jadwal:', error);
        res.status(500).json({ message: 'Gagal memperbarui jadwal' });
    }
};
