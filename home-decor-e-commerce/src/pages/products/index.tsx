import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchProducts } from '@/store/slices/productSlice';

export default function ProductsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, error } = useSelector((state: RootState) => state.products);

    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceRange, setPriceRange] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    let filteredProducts = products;
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(prod => prod.category === categoryFilter);
    }
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(prod => prod.price >= min && prod.price <= max);
    }

    return (
        <Layout>
            <Head>
                <title>Products | Home Decor</title>
                <meta name="description" content="Browse our home decor products." />
            </Head>

            <h1 className="text-3xl font-bold mb-6">All Products</h1>

            <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">All Categories</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Wall Art">Wall Art</option>
                        <option value="Lighting">Lighting</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Price Range</label>
                    <select
                        value={priceRange}
                        onChange={e => setPriceRange(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">All Price Ranges</option>
                        <option value="0-50">$0-$50</option>
                        <option value="50-100">$50-$100</option>
                        <option value="100-300">$100-$300</option>
                    </select>
                </div>
            </div>

            {loading && <p className="text-gray-700">Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </Layout>
    );
}

