import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Calendar, UserCog } from 'lucide-react';
import { Header } from '../components/Header';
import './DashboardLayout.css';

export const DashboardLayout = () => {
    return (
        <>
            <Header />
            <div className="dashboard-layout">
                <aside className="dashboard-sidebar">
                    <nav className="sidebar-nav">
                        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                        
                        <NavLink to="/dashboard/anggota" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Users size={20} />
                            <span>Kelola Anggota</span>
                        </NavLink>
                        
                        <NavLink to="/dashboard/roadmaps" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <BookOpen size={20} />
                            <span>Kelola Materi</span>
                        </NavLink>
                        
                        <NavLink to="/dashboard/jadwal" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Calendar size={20} />
                            <span>Kelola Jadwal</span>
                        </NavLink>

                        <div className="nav-divider"></div>

                        <NavLink to="/dashboard/users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <UserCog size={20} />
                            <span>Kelola Pengguna</span>
                        </NavLink>
                    </nav>
                </aside>

                <main className="dashboard-main">
                    <Outlet />
                </main>
            </div>
        </>
    );
};