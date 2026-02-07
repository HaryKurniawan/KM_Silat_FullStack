
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing connection...');
        const categories = await prisma.kategoriRoadmap.findMany({
            include: { items: true }
        });
        console.log('Success!', JSON.stringify(categories, null, 2));
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
