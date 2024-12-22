import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET': {
                const { orderId } = req.query;
                if (orderId) {
                    const order = await prisma.order.findUnique({
                        where: { id: Number(orderId) },
                    });
                    if (!order) return res.status(404).json({ error: 'Order not found' });

                    const parsedItems = JSON.parse(order.orderItems);
                    return res.status(200).json({ ...order, orderItems: parsedItems });
                } else {
                    const orders = await prisma.order.findMany();
                    const parsedOrders = orders.map(o => ({
                        ...o,
                        orderItems: JSON.parse(o.orderItems),
                    }));
                    return res.status(200).json(parsedOrders);
                }
            }

            case 'POST': {
                const { orderItems } = req.body;
                if (!orderItems) {
                    return res.status(400).json({ error: 'Missing orderItems' });
                }
                const newOrder = await prisma.order.create({
                    data: { orderItems: JSON.stringify(orderItems) },
                });
                return res.status(201).json(newOrder);
            }

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}