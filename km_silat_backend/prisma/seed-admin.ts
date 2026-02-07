import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdminUser() {
    try {
        // Check if admin already exists
        const existingAdmin = await prisma.pengguna.findUnique({
            where: { username: 'admin' },
        });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const admin = await prisma.pengguna.create({
            data: {
                username: 'admin',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        console.log('✅ Admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('⚠️  IMPORTANT: Please change the password after first login!');
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdminUser();