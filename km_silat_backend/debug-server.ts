import prisma from './src/lib/prisma';

async function test() {
    console.log('Testing database connection...');
    try {
        const categories = await prisma.kategoriRoadmap.findMany({
            include: { items: true }
        });
        console.log('Success! Found ' + categories.length + ' categories.');
    } catch (error: any) {
        console.error('DATABASE ERROR:', error);
        if (error.code) console.error('Error Code:', error.code);
        if (error.meta) console.error('Error Meta:', error.meta);
        process.exit(1);
    }
}

test();
