export interface Comment {
    id: string;
    userName: string;
    userAvatar: string; // Emoji
    content: string;
    date: string;
    likes: number;
    isLiked: boolean;
}

export const initialComments: Record<string, Comment[]> = {
    'dasar-kuda-kuda': [
        {
            id: '1',
            userName: 'Budi Santoso',
            userAvatar: '👦',
            content: 'Teknik ini sangat efektif untuk serangan balik. Terima kasih penjelasannya!',
            date: '2 jam yang lalu',
            likes: 12,
            isLiked: false
        },
        {
            id: '2',
            userName: 'Siti Aminah',
            userAvatar: '🧕',
            content: 'Izin bertanya, apakah kuda-kuda ini bisa dikombinasikan dengan tendangan T?',
            date: '5 jam yang lalu',
            likes: 5,
            isLiked: true
        }
    ],
    'tendangan-dasar': [
        {
            id: '3',
            userName: 'Rizky Pratama',
            userAvatar: '🧑',
            content: 'Tendangan T saya masih sering goyah, ada tips untuk keseimbangan?',
            date: '1 hari yang lalu',
            likes: 8,
            isLiked: false
        },
        {
            id: '4',
            userName: 'Dewi Lestari',
            userAvatar: '👩',
            content: 'Video tutorialnya sangat jelas, terima kasih coach!',
            date: '3 jam yang lalu',
            likes: 3,
            isLiked: false
        }
    ],
    'jurus-tunggal': [
        {
            id: '5',
            userName: 'Ahmad Wijaya',
            userAvatar: '👨',
            content: 'Bagian Wiraga-nya perlu latihan ekstra nih. Semangat!',
            date: '2 hari yang lalu',
            likes: 15,
            isLiked: false
        }
    ]
};
