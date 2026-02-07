
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const schedules = [
        { id: 1, hari: 'Senin', status: 'Latihan', waktu: '16.00 - 17.30', lokasi: 'Lapangan Utama' },
        { id: 2, hari: 'Selasa', status: 'Istirahat', waktu: '-', lokasi: '-' },
        { id: 3, hari: 'Rabu', status: 'Istirahat', waktu: '-', lokasi: '-' },
        { id: 4, hari: 'Kamis', status: 'Latihan', waktu: '16.00 - 17.30', lokasi: 'Lapangan Utama' },
        { id: 5, hari: 'Jumat', status: 'Istirahat', waktu: '-', lokasi: '-' },
        { id: 6, hari: 'Sabtu', status: 'Latihan', waktu: '08.00 - 10.00', lokasi: 'Aula Latihan' },
        { id: 0, hari: 'Minggu', status: 'Istirahat', waktu: '-', lokasi: '-' },
    ];

    console.log('Seeding schedules...');
    for (const s of schedules) {
        await prisma.jadwal.upsert({
            where: { id: s.id },
            update: s,
            create: s,
        });
    }
    console.log('Done!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
