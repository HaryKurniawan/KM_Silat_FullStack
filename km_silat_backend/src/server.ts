import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';
import prisma from './lib/prisma';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// DB Health Check
app.get('/api/db-health', async (req, res) => {
    try {
        const count = await prisma.kategoriRoadmap.count();
        res.json({ status: 'ok', categories: count });
    } catch (error: any) {
        console.error('DB Health Check Failed:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('KM Silat API Running');
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('UNHANDLED ERROR:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Using Database: ${process.env.DATABASE_URL ? 'FOUND' : 'NOT FOUND'}`);
    console.log('Server restarted at:', new Date().toISOString());
});
