import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Clear existing records
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();

    await prisma.product.createMany({
        data: [
            {
                name: 'Modern Sofa',
                category: 'Furniture',
                price: 150,
                description: 'A comfortable modern sofa',
                image: '/sofa.jpg',
            },
            {
                name: 'Abstract Wall Art',
                category: 'Wall Art',
                price: 80,
                description: 'Colorful abstract wall art',
                image: '/wall-art.jpg',
            },
            {
                name: 'Rustic Table Lamp',
                category: 'Lighting',
                price: 45,
                description: 'Wooden table lamp with a rustic style',
                image: '/rustic-lamp.jpg',
            },
        ],
    });

    console.log('Seed data inserted successfully!');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
