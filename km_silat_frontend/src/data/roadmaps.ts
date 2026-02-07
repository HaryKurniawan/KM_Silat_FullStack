// Data roadmap untuk kategori Tanding dan Seni
export interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    label: 'Teknik' | 'Fisik' | 'Tanding' | 'Tampil';
    videoUrl: string;
    videoType: 'youtube' | 'instagram';
    detailedContent: string;
    icon: string;
}

export interface RoadmapCategory {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    accentColor: string;
    items: RoadmapItem[];
}

export const tandingRoadmap: RoadmapCategory = {
    id: 'tanding',
    title: 'Kategori Tanding',
    subtitle: 'Persiapan Pertandingan',
    description: 'Roadmap persiapan untuk kategori tanding pencak silat',
    accentColor: '#22c55e',
    items: [
        {
            id: 'dasar-kuda-kuda',
            title: 'Dasar Kuda-Kuda',
            description: 'Pelajari posisi dasar kuda-kuda yang benar',
            label: 'Teknik',
            icon: 'technique',
            videoUrl: 'https://www.youtube.com/watch?v=example1',
            videoType: 'youtube',
            detailedContent: `
## Dasar Kuda - Kuda Pencak Silat

Kuda - kuda adalah posisi dasar dalam pencak silat yang menjadi fondasi semua gerakan.Posisi kuda - kuda yang benar akan memberikan keseimbangan dan kekuatan dalam bertanding.

### Jenis Kuda - Kuda:
1. ** Kuda - kuda Tengah ** - Posisi kedua kaki sejajar dengan lebar bahu
2. ** Kuda - kuda Depan ** - Kaki depan ditekuk, kaki belakang lurus
3. ** Kuda - kuda Belakang ** - Kaki belakang ditekuk, kaki depan lurus
4. ** Kuda - kuda Samping ** - Posisi menyamping dengan satu kaki ditekuk

### Tips Latihan:
- Latihan kuda - kuda minimal 15 menit sehari
    - Fokus pada keseimbangan dan postur tubuh
        - Kombinasikan dengan latihan pernapasan
            `
        },
        {
            id: 'pukulan-dasar',
            title: 'Teknik Pukulan',
            description: 'Menguasai berbagai jenis pukulan untuk tanding',
            label: 'Teknik',
            icon: 'punch',
            videoUrl: 'https://www.youtube.com/watch?v=example2',
            videoType: 'youtube',
            detailedContent: `
## Teknik Pukulan Pencak Silat

Pukulan dalam pencak silat memiliki berbagai variasi yang dapat digunakan dalam pertandingan.

### Jenis Pukulan:
1. ** Pukulan Lurus ** - Pukulan langsung ke depan
2. ** Pukulan Sangkol ** - Pukulan dari bawah ke atas(uppercut)
3. ** Pukulan Bandul ** - Pukulan dari samping
4. ** Pukulan Tegak ** - Pukulan dengan kepalan vertikal

### Poin Penilaian:
- Pukulan yang masuk ke area sasaran mendapat 1 poin
    - Eksekusi yang tepat dengan tenaga penuh lebih bernilai
        `
        },
        {
            id: 'tendangan-dasar',
            title: 'Teknik Tendangan',
            description: 'Berbagai variasi tendangan untuk mencetak poin',
            label: 'Teknik',
            icon: 'kick',
            videoUrl: 'https://www.youtube.com/watch?v=example3',
            videoType: 'youtube',
            detailedContent: `
## Teknik Tendangan Pencak Silat

Tendangan adalah serangan yang memiliki jangkauan lebih panjang dan kekuatan lebih besar.

### Jenis Tendangan:
1. ** Tendangan Lurus ** - Tendangan ke depan dengan tumit / telapak kaki
2. ** Tendangan Sabit ** - Tendangan melingkar dari samping
3. ** Tendangan T ** - Tendangan menyamping
4. ** Tendangan Belakang ** - Tendangan ke arah belakang

### Tips:
- Latihan fleksibilitas untuk tendangan tinggi
    - Jaga keseimbangan saat melakukan tendangan
        `
        },
        {
            id: 'strategi-tanding',
            title: 'Strategi Bertanding',
            description: 'Taktik dan strategi memenangkan pertandingan',
            label: 'Tanding',
            icon: 'strategy',
            videoUrl: 'https://www.youtube.com/watch?v=example4',
            videoType: 'youtube',
            detailedContent: `
## Strategi Bertanding

Memahami strategi dan taktik dalam pertandingan pencak silat.

### Strategi Dasar:
1. ** Serang - Bertahan ** - Kombinasi serangan dan pertahanan
2. ** Counter Attack ** - Memanfaatkan serangan lawan
3. ** Pressure Fighting ** - Menekan lawan terus menerus
4. ** Point Fighting ** - Fokus mengumpulkan poin

### Mental Bertanding:
- Tetap tenang dan fokus
    - Baca gerakan lawan
        - Kontrol jarak dan timing
            `
        },
        {
            id: 'kondisi-fisik',
            title: 'Kondisi Fisik',
            description: 'Program latihan fisik untuk persiapan kejuaraan',
            label: 'Fisik',
            icon: 'physical',
            videoUrl: 'https://www.youtube.com/watch?v=example5',
            videoType: 'youtube',
            detailedContent: `
## Program Kondisi Fisik

Persiapan fisik yang optimal untuk menghadapi kejuaraan.

### Komponen Latihan:
1. ** Cardio ** - Lari, skipping, berenang
2. ** Kekuatan ** - Push up, sit up, squat
3. ** Fleksibilitas ** - Stretching, yoga
4. ** Agility ** - Ladder drill, cone drill

### Program Mingguan:
- Senin: Cardio + Teknik
    - Selasa: Kekuatan
        - Rabu: Sparring ringan
            - Kamis: Cardio + Teknik
                - Jumat: Kekuatan
                    - Sabtu: Sparring
                        - Minggu: Recovery
                            `
        }
    ]
};

export const seniRoadmap: RoadmapCategory = {
    id: 'seni',
    title: 'Kategori Seni',
    subtitle: 'Persiapan Penampilan',
    description: 'Roadmap persiapan untuk kategori seni pencak silat',
    accentColor: '#f59e0b',
    items: [
        {
            id: 'jurus-tunggal',
            title: 'Jurus Tunggal',
            description: 'Menguasai rangkaian jurus tunggal standar',
            label: 'Teknik',
            icon: 'art',
            videoUrl: 'https://www.youtube.com/watch?v=example6',
            videoType: 'youtube',
            detailedContent: `
## Jurus Tunggal Pencak Silat

Jurus tunggal adalah rangkaian gerakan yang dilakukan secara individu dengan pola tertentu.

### Komponen Penilaian:
1. ** Wiraga ** - Kebenaran gerak dan sikap
2. ** Wirama ** - Irama dan ketepatan waktu
3. ** Wirasa ** - Ekspresi dan penghayatan

### Tips Latihan:
- Hafal urutan gerakan dengan benar
    - Latihan dengan musik / hitungan
        - Perhatikan detail setiap gerakan
            `
        },
        {
            id: 'jurus-ganda',
            title: 'Jurus Ganda',
            description: 'Koordinasi gerakan berpasangan',
            label: 'Teknik',
            icon: 'double',
            videoUrl: 'https://www.youtube.com/watch?v=example7',
            videoType: 'youtube',
            detailedContent: `
## Jurus Ganda Pencak Silat

Jurus ganda melibatkan dua pesilat yang melakukan gerakan serang - bela secara terkoordinasi.

### Aspek Penting:
1. ** Sinkronisasi ** - Timing yang tepat antara kedua pesilat
2. ** Jarak ** - Pengaturan jarak yang konsisten
3. ** Ekspresi ** - Penghayatan bersama

### Latihan:
- Latihan timing dengan hitungan
    - Latihan eye contact
        - Repetisi berkala dengan pasangan
            `
        },
        {
            id: 'jurus-regu',
            title: 'Jurus Regu',
            description: 'Koordinasi gerakan dalam tim 3 orang',
            label: 'Teknik',
            icon: 'team',
            videoUrl: 'https://www.youtube.com/watch?v=example8',
            videoType: 'youtube',
            detailedContent: `
## Jurus Regu Pencak Silat

Jurus regu melibatkan tiga pesilat dengan koreografi yang lebih kompleks.

### Komponen:
1. ** Kekompakan ** - Gerakan serempak yang sempurna
2. ** Formasi ** - Perpindahan posisi yang rapi
3. ** Kreativitas ** - Variasi gerakan yang menarik

### Strategi Latihan:
- Latihan terpisah, lalu gabung
    - Video rekaman untuk evaluasi
        - Latihan dengan musik pertandingan
            `
        },
        {
            id: 'ekspresi-penghayatan',
            title: 'Ekspresi & Penghayatan',
            description: 'Meningkatkan wirasa dalam penampilan',
            label: 'Teknik',
            icon: 'expression',
            videoUrl: 'https://www.youtube.com/watch?v=example9',
            videoType: 'youtube',
            detailedContent: `
## Ekspresi dan Penghayatan(Wirasa)

Wirasa adalah aspek penghayatan yang membuat penampilan menjadi hidup.

### Elemen Wirasa:
1. ** Ekspresi Wajah ** - Menunjukkan karakter gerakan
2. ** Tenaga ** - Pengaturan dinamika tenaga
3. ** Nafas ** - Sinkronisasi nafas dan gerakan

### Tips:
- Pahami makna setiap gerakan
    - Latihan di depan cermin
        - Visualisasikan lawan / situasi
            `
        },
        {
            id: 'persiapan-mental',
            title: 'Persiapan Mental',
            description: 'Mental preparation untuk penampilan maksimal',
            label: 'Tampil',
            icon: 'mental',
            videoUrl: 'https://www.youtube.com/watch?v=example10',
            videoType: 'youtube',
            detailedContent: `
## Persiapan Mental

Mental yang kuat adalah kunci penampilan yang sempurna.

### Teknik Mental:
1. ** Visualisasi ** - Bayangkan penampilan sempurna
2. ** Breathing ** - Teknik pernapasan untuk relaksasi
3. ** Routine ** - Ritual sebelum tampil

### Mengatasi Nervous:
- Latihan simulasi pertandingan
    - Fokus pada proses, bukan hasil
        - Positive self - talk
            `
        }
    ]
};

export const getRoadmapByCategory = (category: string, subCategory?: string): RoadmapCategory | null => {
    if (category === 'tanding') return tandingRoadmap;
    if (category === 'seni' && subCategory === 'tunggal') return seniRoadmap;
    if (category === 'seni' && !subCategory) return seniRoadmap; // fallback
    return null;
};

export const getRoadmapItem = (category: string, itemId: string): RoadmapItem | null => {
    const roadmap = getRoadmapByCategory(category);
    if (!roadmap) return null;
    return roadmap.items.find(item => item.id === itemId) || null;
};
