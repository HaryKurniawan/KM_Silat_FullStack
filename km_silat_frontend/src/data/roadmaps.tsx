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
