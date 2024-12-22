import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const productId = parseInt(id as string, 10);

    if (isNaN(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        switch (req.method) {
            case 'GET': {
                const product = await prisma.product.findUnique({
                    where: { id: productId },
                });
                if (!product) {
                    return res.status(404).json({ error: 'Product not found' });
                }
                return res.status(200).json(product);
            }

            case 'PUT':
            case 'PATCH': {
                const { name, category, price, description, image } = req.body;
                const updatedProduct = await prisma.product.update({
                    where: { id: productId },
                    data: { name, category, price, description, image },
                });
                return res.status(200).json(updatedProduct);
            }

            case 'DELETE': {
                await prisma.product.delete({
                    where: { id: productId },
                });
                return res.status(204).end();
            }

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in products/[id].ts:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
