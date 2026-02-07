import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, User, Users } from 'lucide-react';
import './KnowledgeManagementPage.css';
import { anggotaService } from '../services/api';

type SortOption = 'name' | 'championships';
type SpecialtyFilter = 'All' | 'Seni' | 'Tanding';
type AchievementFilter = 'All' | 'Juara 1' | 'Juara 2' | 'Juara 3';

interface Championship {
    name: string;
    year: number;
    achievement: string;
}

interface Student {
    id: string;
    name: string;
    role: 'Pelatih' | 'Anggota';
    batch: string;
    specialty: 'Seni' | 'Tanding';
    championships: Championship[];
}

export const KnowledgeManagementPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'Pelatih' | 'Anggota'>('Anggota');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [specialtyFilter, setSpecialtyFilter] = useState<SpecialtyFilter>('All');
    const [achievementFilter, setAchievementFilter] = useState<AchievementFilter>('All');
    const [sortBy, setSortBy] = useState<SortOption>('championships');
    const [studentsData, setStudentsData] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await anggotaService.getAll();
                // Map API data to component nested structure
                const mappedData: Student[] = response.data.map((item: any) => ({
                    id: item.id,
                    name: item.nama,
                    role: item.peran as 'Pelatih' | 'Anggota',
                    batch: item.angkatan,
                    specialty: item.spesialisasi as 'Seni' | 'Tanding',
                    championships: item.kejuaraan?.map((c: { nama: string; tahun: number; prestasi: string }) => ({
                        name: c.nama,
                        year: c.tahun,
                        achievement: c.prestasi
                    })) || []
                }));
                setStudentsData(mappedData);
            } catch (error: any) {
                console.error("Failed to fetch students", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredAndSortedStudents = useMemo(() => {
        return studentsData
            .filter(student => {
                const matchesRole = student.role === activeTab;
                const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesSpecialty = specialtyFilter === 'All' || student.specialty === specialtyFilter;

                let matchesAchievement = true;
                if (achievementFilter !== 'All') {
                    if (student.championships.length === 0) {
                        matchesAchievement = false;
                    } else {
                        matchesAchievement = student.championships.some((c: Championship) =>
                            c.achievement.toLowerCase().includes(achievementFilter.toLowerCase())
                        );
                    }
                }

                return matchesRole && matchesSearch && matchesSpecialty && matchesAchievement;
            })
            .sort((a, b) => {
                if (sortBy === 'championships') {
                    return b.championships.length - a.championships.length;
                }
                return a.name.localeCompare(b.name);
            });
    }, [searchQuery, activeTab, specialtyFilter, achievementFilter, sortBy]);

    return (
        <div className="km-page">
            <PageHeader
                title="Knowledge Management"
                subtitle="Data Anggota dan Prestasi UKM Pencak Silat"
                backTo="/"
            />

            <div className="km-content">
                {/* Role Tabs */}
                <div className="role-tabs">
                    <button
                        className={`role-tab ${activeTab === 'Anggota' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Anggota')}
                    >
                        <Users size={18} />
                        <span>Anggota</span>
                    </button>
                    <button
                        className={`role-tab ${activeTab === 'Pelatih' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Pelatih')}
                    >
                        <User size={18} />
                        <span>Pelatih</span>
                    </button>
                </div>

                <div className="km-controls-container">
                    <div className="search-bar">
                        <Search className="search-icon-lucide" size={20} />
                        <input
                            type="text"
                            placeholder={`Cari nama ${activeTab.toLowerCase()}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        className={`filter-toggle-btn ${isFilterOpen ? 'active' : ''}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <SlidersHorizontal size={18} />
                        <span>Filter & Urutkan</span>
                        {isFilterOpen ? <ChevronUp size={16} className="toggle-icon-lucide" /> : <ChevronDown size={16} className="toggle-icon-lucide" />}
                    </button>
                </div>

                {/* Collapsible Filter Panel */}
                <div className={`filter-panel ${isFilterOpen ? 'open' : ''}`}>
                    <div className="filters-row">
                        <div className="filter-group">
                            <span className="filter-label">Kategori:</span>
                            <div className="filter-options">
                                <button
                                    className={`filter-chip ${specialtyFilter === 'All' ? 'active' : ''}`}
                                    onClick={() => setSpecialtyFilter('All')}
                                >
                                    Semua
                                </button>
                                <button
                                    className={`filter-chip ${specialtyFilter === 'Tanding' ? 'active' : ''}`}
                                    onClick={() => setSpecialtyFilter('Tanding')}
                                >
                                    Tanding
                                </button>
                                <button
                                    className={`filter-chip ${specialtyFilter === 'Seni' ? 'active' : ''}`}
                                    onClick={() => setSpecialtyFilter('Seni')}
                                >
                                    Seni
                                </button>
                            </div>
                        </div>

                        <div className="filter-group">
                            <span className="filter-label">Prestasi:</span>
                            <div className="filter-options">
                                {['All', 'Juara 1', 'Juara 2', 'Juara 3'].map((option) => (
                                    <button
                                        key={option}
                                        className={`filter-chip ${achievementFilter === option ? 'active' : ''}`}
                                        onClick={() => setAchievementFilter(option as AchievementFilter)}
                                    >
                                        {option === 'All' ? 'Semua' : option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group ml-auto">
                            <span className="filter-label">Urutkan:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="sort-select"
                            >
                                <option value="name">Nama (A-Z)</option>
                                <option value="championships">Prestasi Terbanyak</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="students-grid">
                    {loading ? (
                        <div className="empty-state">
                            <p>Loading data...</p>
                        </div>
                    ) : filteredAndSortedStudents.length > 0 ? (
                        filteredAndSortedStudents.map(student => (
                            <div key={student.id} className="student-card">
                                <div className="student-header">
                                    <div className="student-info">
                                        <h3 className="student-name">{student.name}</h3>
                                        <span className="student-batch">Angkatan {student.batch}</span>
                                    </div>
                                    <span className={`student-specialty ${student.specialty.toLowerCase()}`}>
                                        {student.specialty}
                                    </span>
                                </div>

                                <div className="championships-list">
                                    <div className="champ-header">
                                        <h4>Riwayat Kejuaraan</h4>
                                        <span className="champ-count">{student.championships.length}</span>
                                    </div>
                                    {student.championships.length > 0 ? (
                                        <ul>
                                            {student.championships.map((champ: { year: number; name: string; achievement: string }, idx: number) => (
                                                <li key={idx}>
                                                    <div className="champ-year-badge">{champ.year}</div>
                                                    <div className="champ-details">
                                                        <span className="champ-name">{champ.name}</span>
                                                        <span className="champ-achievement">{champ.achievement}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="no-data">Belum ada data kejuaraan</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>Tidak ada data {activeTab.toLowerCase()} yang sesuai filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
