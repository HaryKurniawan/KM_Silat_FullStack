
import { Router } from 'express';
import { login } from '../controllers/authController';
import { getAllAnggota, createAnggota, updateAnggota, deleteAnggota, addKejuaraan, updateKejuaraan, deleteKejuaraan } from '../controllers/anggotaController';
import {
    getCategories,
    createCategory,
    getItemsByCategory,
    createItem,
    getItemDetail,
    getCommentsByItem,
    createComment,
    deleteComment,
    toggleLikeComment
} from '../controllers/roadmapController';
import { getDashboardStats } from '../controllers/statsController';
import { getJadwal, updateJadwal } from '../controllers/jadwalController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Auth
router.post('/auth/login', login);

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

// Roadmaps (Public Read, Admin Write)
router.get('/roadmap-categories', getCategories);
router.post('/roadmap-categories', authenticateToken, createCategory);

router.get('/roadmaps/:categoryId', getItemsByCategory);
router.get('/roadmap-items/:id', getItemDetail);
router.post('/roadmap-items', authenticateToken, createItem);

router.get('/roadmap-items/:itemId/comments', getCommentsByItem);
router.post('/roadmap-items/:itemId/comments', createComment);
router.delete('/comments/:id', deleteComment);
router.post('/comments/:id/like', toggleLikeComment);

export default router;
