
import type { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Get All Anggota
export const getAllAnggota = async (req: Request, res: Response) => {
    try {
        const anggota = await prisma.anggota.findMany({
            include: { kejuaraan: true }
        });
        res.json(anggota);
    } catch (error) {
        console.error('Error fetching all anggota:', error);
        res.status(500).json({ message: 'Gagal mengambil data anggota' });
    }
};

// Create Anggota
export const createAnggota = async (req: Request, res: Response) => {
    const { nama, peran, angkatan, spesialisasi } = req.body;

    if (!nama || !peran || !angkatan) {
        res.status(400).json({ message: 'Nama, peran, dan angkatan wajib diisi' });
        return;
    }

    try {
        const newAnggota = await prisma.anggota.create({
            data: { nama, peran, angkatan, spesialisasi: spesialisasi || '-' }
        });
        res.status(201).json(newAnggota);
    } catch (error) {
        console.error('Error creating anggota:', error);
        res.status(500).json({ message: 'Gagal menambahkan anggota' });
    }
};

// Add Kejuaraan to Anggota
export const addKejuaraan = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama, tahun, prestasi } = req.body;

    const tahunInt = parseInt(tahun);
    if (isNaN(tahunInt)) {
        res.status(400).json({ message: 'Tahun harus berupa angka' });
        return;
    }

    if (!nama || !prestasi) {
        res.status(400).json({ message: 'Nama kejuaraan dan prestasi wajib diisi' });
        return;
    }

    try {
        const newKejuaraan = await prisma.kejuaraan.create({
            data: {
                nama,
                tahun: tahunInt,
                prestasi,
                anggotaId: String(id)
            }
        });
        res.status(201).json(newKejuaraan);
    } catch (error) {
        console.error('Error adding kejuaraan:', error);
        res.status(500).json({ message: 'Gagal menambahkan data kejuaraan' });
    }
};

// Update Kejuaraan
export const updateKejuaraan = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama, tahun, prestasi } = req.body;

    const data: any = {};
    if (nama) data.nama = nama;
    if (prestasi) data.prestasi = prestasi;
    if (tahun) {
        const tahunInt = parseInt(tahun);
        if (isNaN(tahunInt)) {
            res.status(400).json({ message: 'Tahun harus berupa angka' });
            return;
        }
        data.tahun = tahunInt;
    }

    try {
        const updatedKejuaraan = await prisma.kejuaraan.update({
            where: { id: String(id) },
            data
        });
        res.json(updatedKejuaraan);
    } catch (error) {
        console.error('Error updating kejuaraan:', error);
        res.status(500).json({ message: 'Gagal update data kejuaraan' });
    }
};

// Delete Kejuaraan
export const deleteKejuaraan = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.kejuaraan.delete({
            where: { id: String(id) }
        });
        res.json({ message: 'Data kejuaraan dihapus' });
    } catch (error) {
        console.error('Error deleting kejuaraan:', error);
        res.status(500).json({ message: 'Gagal menghapus data kejuaraan' });
    }
};

// Update Anggota
export const updateAnggota = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama, peran, angkatan, spesialisasi } = req.body;
    try {
        const updatedAnggota = await prisma.anggota.update({
            where: { id: String(id) },
            data: { nama, peran, angkatan, spesialisasi }
        });
        res.json(updatedAnggota);
    } catch (error) {
        console.error('Error updating anggota:', error);
        res.status(500).json({ message: 'Gagal update anggota' });
    }
};

// Delete Anggota
export const deleteAnggota = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.anggota.delete({ where: { id: String(id) } });
        res.json({ message: 'Anggota dihapus' });
    } catch (error) {
        console.error('Error deleting anggota:', error);
        res.status(500).json({ message: 'Gagal menghapus anggota' });
    }
};
