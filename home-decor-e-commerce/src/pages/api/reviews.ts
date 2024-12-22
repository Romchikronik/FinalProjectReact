import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const productId = req.query.productId;
        if (!productId) {
            return res.status(400).json({ error: 'Missing productId query param' });
        }

        switch (req.method) {
            case 'GET': {
                const reviews = await prisma.review.findMany({
                    where: { productId: Number(productId) },
                });
                return res.status(200).json(reviews);
            }

            case 'POST': {
                const { user, text, rating } = req.body;
                if (!user || !text || rating == null) {
                    return res.status(400).json({ error: 'Missing fields in request body' });
                }

                const newReview = await prisma.review.create({
                    data: {
                        user,
                        text,
                        rating,
                        product: { connect: { id: Number(productId) } },
                    },
                });
                return res.status(201).json(newReview);
            }

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
