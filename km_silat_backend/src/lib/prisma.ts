import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.warn('WARNING: DATABASE_URL not found in environment variables!');
}

const prisma = new PrismaClient();

export default prisma;
