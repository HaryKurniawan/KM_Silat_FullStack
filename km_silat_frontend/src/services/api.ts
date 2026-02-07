import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials: any) => api.post('/auth/login', credentials),
};

export const userService = {
    getAll: () => api.get('/users'),
    create: (data: any) => api.post('/users', data),
    update: (id: string, data: any) => api.put(`/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/${id}`),
};

export const anggotaService = {
    getAll: () => api.get('/anggota'),
    create: (data: any) => api.post('/anggota', data),
    update: (id: string, data: any) => api.put(`/anggota/${id}`, data),
    delete: (id: string) => api.delete(`/anggota/${id}`),
    addKejuaraan: (id: string, data: any) => api.post(`/anggota/${id}/kejuaraan`, data),
    updateKejuaraan: (id: string, data: any) => api.put(`/kejuaraan/${id}`, data),
    deleteKejuaraan: (id: string) => api.delete(`/kejuaraan/${id}`),
};

export const roadmapService = {
    getCategories: () => api.get('/roadmap-categories'),
    createCategory: (data: any) => api.post('/roadmap-categories', data),
    getItemsByCategory: (categoryId: string) => api.get(`/roadmaps/${categoryId}`),
    getItemDetail: (id: string) => api.get(`/roadmap-items/${id}`),
    createItem: (data: any) => api.post('/roadmap-items', data),
    getCommentsByItem: (itemId: string) => api.get(`/roadmap-items/${itemId}/comments`),
    addComment: (itemId: string, data: { isi: string; namaPengguna?: string; parentId?: string }) => api.post(`/roadmap-items/${itemId}/comments`, data),
    deleteComment: (id: string) => api.delete(`/comments/${id}`),
    likeComment: (id: string) => api.post(`/comments/${id}/like`),
};

export const jadwalService = {
    getAll: () => api.get('/jadwal'),
    update: (id: number, data: { status: string; waktu: string; lokasi: string }) => api.put(`/jadwal/${id}`, data),
};

export const statsService = {
    getStats: () => api.get('/stats'),
};

export default api;