export interface Championship {
    name: string;
    year: number;
    achievement: string;
}

export interface Student {
    id: string;
    name: string;
    role: 'Pelatih' | 'Anggota';
    batch: string; // Angkatan
    specialty: 'Seni' | 'Tanding';
    championships: Championship[];
}

export const students: Student[] = [
    {
        id: '1',
        name: 'Budi Santoso',
        role: 'Pelatih',
        batch: '2020',
        specialty: 'Tanding',
        championships: [
            { name: 'Kejuaraan Nasional Pencak Silat', year: 2022, achievement: 'Juara 1 Kelas A Putra' },
            { name: 'Pekan Olahraga Mahasiswa', year: 2023, achievement: 'Juara 2 Kelas A Putra' }
        ]
    },
    {
        id: '2',
        name: 'Siti Aminah',
        role: 'Anggota',
        batch: '2021',
        specialty: 'Seni',
        championships: [
            { name: 'Festival Silat Internasional', year: 2023, achievement: 'Juara 1 Tunggal Putri' }
        ]
    },
    {
        id: '3',
        name: 'Rizky Pratama',
        role: 'Anggota',
        batch: '2022',
        specialty: 'Tanding',
        championships: []
    },
    {
        id: '4',
        name: 'Dewi Lestari',
        role: 'Pelatih', // Adding another coach for variety
        batch: '2021',
        specialty: 'Seni',
        championships: [
            { name: 'Kejuaraan Daerah', year: 2022, achievement: 'Juara 3 Ganda Putri' }
        ]
    },
    {
        id: '5',
        name: 'Ahmad Fauzi',
        role: 'Anggota',
        batch: '2023',
        specialty: 'Tanding',
        championships: []
    }
];
