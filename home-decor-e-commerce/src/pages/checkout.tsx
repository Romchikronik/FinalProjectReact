import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function CheckoutPage() {
    const [isLoading, setIsLoading] = useState(false);
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems,
                    successUrl: 'http://localhost:3000/checkout/success',
                    cancelUrl: 'http://localhost:3000/checkout?canceled=true',
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No Stripe checkout URL returned');
            }
        } catch (error) {
            console.error('Error creating Stripe checkout session:', error);
            alert('Something went wrong with checkout.');
        } finally {
            setIsLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <Layout>
                <p>Your cart is empty, nothing to checkout.</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl mb-4">Checkout</h1>
            <p className="mb-4">Total: ${totalAmount.toFixed(2)}</p>
            <button
                className="bg-blue-500 text-white px-4 py-2"
                disabled={isLoading}
                onClick={handleCheckout}
            >
                {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
        </Layout>
    );
}
