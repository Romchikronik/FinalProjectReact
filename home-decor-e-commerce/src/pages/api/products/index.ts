import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET': {
                const products = await prisma.product.findMany();
                return res.status(200).json(products);
            }

            case 'POST': {
                const { name, category, price, description, image } = req.body;
                if (!name || !category || !price || !description) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }
                const newProduct = await prisma.product.create({
                    data: { name, category, price, description, image },
                });
                return res.status(201).json(newProduct);
            }

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in products/index.ts:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

