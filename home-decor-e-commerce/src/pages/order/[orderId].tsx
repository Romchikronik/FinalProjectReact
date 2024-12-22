import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

export default function OrderDetailsPage() {
    const router = useRouter();
    const { orderId } = router.query;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetch(`/api/orders?orderId=${orderId}`)
                .then(res => res.json())
                .then(data => {
                    setOrder(data);
                    setLoading(false);
                });
        }
    }, [orderId]);

    if (loading) return <Layout>Loading order data...</Layout>;

    if (!order || order.error) {
        return (
            <Layout>
                <p>{order?.error || 'Order not found'}</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl mb-4">Order #{orderId}</h1>
            <p>Your order has been created successfully.</p>
            <p>Order Items:</p>
            <pre className="bg-gray-100 p-2 mt-2">
                 {JSON.stringify(order.orderItems, null, 2)}
            </pre>
        </Layout>
    );
}
