import * as bcrypt from 'bcryptjs';
import prisma from './lib/prisma';

async function main() {
    console.log('Seeding database...');

    // 0. Initial Cleanup (Optional but recommended for repeatable seeding)
    await prisma.itemRoadmap.deleteMany();
    await prisma.kategoriRoadmap.deleteMany();
    await prisma.anggota.deleteMany();

    // 1. Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.pengguna.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log({ admin });

    // 2. Create Roadmap Categories
    const tanding = await prisma.kategoriRoadmap.create({
        data: {
            judul: 'Kategori Tanding',
            subjudul: 'Persiapan Pertandingan',
            deskripsi: 'Roadmap persiapan untuk kategori tanding pencak silat',
            warnaAksen: '#22c55e',
            items: {
                create: [
                    {
                        id: 'dasar-kuda-kuda',
                        judul: 'Dasar Kuda-Kuda',
                        deskripsi: 'Pelajari posisi dasar kuda-kuda yang benar',
                        label: 'Teknik',
                        ikon: 'technique',
                        videoUrl: 'https://www.youtube.com/watch?v=example1',
                        tipeVideo: 'youtube',
                        kontenDetail: `## Dasar Kuda-Kuda Pencak Silat... (Detailed content here)`,
                    },
                    {
                        id: 'pukulan-dasar',
                        judul: 'Teknik Pukulan',
                        deskripsi: 'Menguasai berbagai jenis pukulan untuk tanding',
                        label: 'Teknik',
                        ikon: 'punch',
                        videoUrl: 'https://www.youtube.com/watch?v=example2',
                        tipeVideo: 'youtube',
                        kontenDetail: `## Teknik Pukulan...`,
                    },
                ],
            },
        },
    });

    const seni = await prisma.kategoriRoadmap.create({
        data: {
            judul: 'Kategori Seni',
            subjudul: 'Persiapan Penampilan',
            deskripsi: 'Roadmap persiapan untuk kategori seni pencak silat',
            warnaAksen: '#f59e0b',
            items: {
                create: [
                    {
                        id: 'jurus-tunggal',
                        judul: 'Jurus Tunggal',
                        deskripsi: 'Menguasai rangkaian jurus tunggal standar',
                        label: 'Teknik',
                        ikon: 'art',
                        videoUrl: 'https://www.youtube.com/watch?v=example6',
                        tipeVideo: 'youtube',
                        kontenDetail: `## Jurus Tunggal...`,
                    },
                    {
                        id: 'jurus-ganda',
                        judul: 'Jurus Ganda',
                        deskripsi: 'Koordinasi gerakan berpasangan',
                        label: 'Teknik',
                        ikon: 'double',
                        videoUrl: 'https://www.youtube.com/watch?v=example7',
                        tipeVideo: 'youtube',
                        kontenDetail: `## Jurus Ganda...`,
                    },
                ],
            },
        },
    });

    console.log({ tanding, seni });

    // 3. Create Anggota
    const anggota = await prisma.anggota.createMany({
        data: [
            {
                nama: 'Budi Santoso',
                peran: 'Pelatih',
                angkatan: '2020',
                spesialisasi: 'Tanding',
            },
            {
                nama: 'Siti Aminah',
                peran: 'Anggota',
                angkatan: '2021',
                spesialisasi: 'Seni',
            },
        ],
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
