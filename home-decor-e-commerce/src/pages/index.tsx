import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';

export default function HomePage() {
    return (
        <Layout>
            <Head>
                <title>Home Decor | Home</title>
                <meta name="description" content="Browse the best home decor items." />
            </Head>
            <div className="text-center my-8">
                <h1 className="text-3xl font-bold">Welcome to Home Decor</h1>
                <p className="mt-4">Find the perfect pieces to style your home.</p>
                <img src="/welcome-home-decor.jpg" alt="Home decor hero" className="mx-auto mt-6" />
            </div>
        </Layout>
    );
}
