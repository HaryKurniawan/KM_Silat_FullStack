import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { DetailPage } from './pages/DetailPage';
import { SeniSelectionPage } from './pages/SeniSelectionPage';
import { KnowledgeManagementPage } from './pages/KnowledgeManagementPage';
import { Login } from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { ManageAnggota } from './pages/dashboard/ManageAnggota';
import { ManageRoadmapItems } from './pages/dashboard/ManageRoadmapItems';
import { ManageJadwal } from './pages/dashboard/ManageJadwal';
import { ManageUsers } from './pages/dashboard/ManageUsers';
import './index.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111827', color: 'white' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role?.toLowerCase() !== 'admin') {
    console.log('ProtectedRoute - User is not admin, redirecting to /');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute - Access granted for admin');
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/knowledge-management" element={<KnowledgeManagementPage />} />
          
          {/* Seni Routes - URUTAN PENTING! */}
          <Route path="/seni" element={<SeniSelectionPage />} />
          <Route path="/seni/:subCategory/:itemId" element={<DetailPage />} />
          <Route path="/seni/:subCategory" element={<RoadmapPage />} />

          {/* Dashboard Routes (Protected - Admin Only) */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="anggota" element={<ManageAnggota />} />
            <Route path="roadmaps" element={<ManageRoadmapItems />} />
            <Route path="jadwal" element={<ManageJadwal />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* Catch-all for other categories */}
          <Route path="/:category/:itemId" element={<DetailPage />} />
          <Route path="/:category" element={<RoadmapPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;