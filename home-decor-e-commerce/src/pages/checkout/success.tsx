import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/slices/cartSlice';

export default function CheckoutSuccess() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(clearCart());
    }, [dispatch]);

    return (
        <Layout>
            <div className="text-center my-20">
                <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
                <p className="text-gray-700">We appreciate your business. Your order is being processed.</p>
            </div>
        </Layout>
    );
}
