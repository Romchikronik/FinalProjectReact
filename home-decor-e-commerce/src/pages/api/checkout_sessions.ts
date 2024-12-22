import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { items, successUrl, cancelUrl } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ error: 'No items to purchase' });
            }

            const lineItems = items.map((item: any) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        // images: [item.image || 'https://example.com/fallback.jpg']
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            }));

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: lineItems,
                success_url: successUrl || 'http://localhost:3000/checkout/success',
                cancel_url: cancelUrl || 'http://localhost:3000/checkout?canceled=true',
            });

            return res.status(200).json({ sessionId: session.id, url: session.url });
        } catch (error: any) {
            console.error('Stripe checkout error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }
}