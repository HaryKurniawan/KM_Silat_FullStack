import { Router } from 'express';
import { login } from '../controllers/authController';
import { getAllAnggota, createAnggota, updateAnggota, deleteAnggota, addKejuaraan, updateKejuaraan, deleteKejuaraan } from '../controllers/anggotaController';
import {
    getCategories,
    getSubCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getItemsByCategory,
    createItem,
    updateItem,
    deleteItem,
    getItemDetail,
    getCommentsByItem,
    createComment,
    deleteComment,
    toggleLikeComment
} from '../controllers/roadmapController';
import { getDashboardStats } from '../controllers/statsController';
import { getJadwal, updateJadwal } from '../controllers/jadwalController';
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Auth
router.post('/auth/login', login);

// User Management (Admin Only)
router.get('/users', authenticateToken, getAllUsers);
router.post('/users', authenticateToken, createUser);
router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);

// Stats
router.get('/stats', getDashboardStats);

// Jadwal (Public Read, Admin Write)
router.get('/jadwal', getJadwal);
router.put('/jadwal/:id', authenticateToken, updateJadwal);

// Anggota (Public Read, Admin Write)
router.get('/anggota', getAllAnggota);
router.post('/anggota', authenticateToken, createAnggota);
router.put('/anggota/:id', authenticateToken, updateAnggota);
router.delete('/anggota/:id', authenticateToken, deleteAnggota);
router.post('/anggota/:id/kejuaraan', authenticateToken, addKejuaraan);
router.put('/kejuaraan/:id', authenticateToken, updateKejuaraan);
router.delete('/kejuaraan/:id', authenticateToken, deleteKejuaraan);

// Roadmap Categories (Public Read, Admin Write)
router.get('/roadmap-categories', getCategories);
router.get('/roadmap-categories/:parentSlug/subcategories', getSubCategories);
router.post('/roadmap-categories', authenticateToken, createCategory);
router.put('/roadmap-categories/:id', authenticateToken, updateCategory);
router.delete('/roadmap-categories/:id', authenticateToken, deleteCategory);

// Roadmap Items (Public Read, Admin Write)
router.get('/roadmaps/:categoryId', getItemsByCategory);
router.get('/roadmap-items/:id', getItemDetail);
router.post('/roadmap-items', authenticateToken, createItem);
router.put('/roadmap-items/:id', authenticateToken, updateItem);
router.delete('/roadmap-items/:id', authenticateToken, deleteItem);

// Comments (Public)
router.get('/roadmap-items/:itemId/comments', getCommentsByItem);
router.post('/roadmap-items/:itemId/comments', createComment);
router.delete('/comments/:id', deleteComment);
router.post('/comments/:id/like', toggleLikeComment);

export default router;