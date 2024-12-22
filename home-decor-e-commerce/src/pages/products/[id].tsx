import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Product, Review } from '@/types';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';

export default function ProductDetailsPage() {
    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);

    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    setProduct(data);
                }
            });

        fetch(`/api/reviews?productId=${id}`)
            .then(res => res.json())
            .then(data => setReviews(data));
    }, [id]);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart(product));
            setIsInCart(true);
            showNotification(`${product.name} added to cart!`, 'success');
        }
    };

    const submitReview = async () => {
        if (!id) return;
        const res = await fetch(`/api/reviews?productId=${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: 'Roman Kolesov', text: reviewText, rating }),
        });
        if (res.ok) {
            showNotification('Review added!', 'success');
            const updatedReviews = await fetch(`/api/reviews?productId=${id}`).then(r => r.json());
            setReviews(updatedReviews);
            setReviewText('');
            setRating(5);
        } else {
            showNotification('Error adding review.', 'error');
        }
    };

    if (!product) {
        return (
            <Layout>
                <p>Loading product...</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head>
                <title>{product.name} | Home Decor</title>
            </Head>

            {notification && (
                <div
                    className={`
                        fixed top-5 right-5 z-50
                        px-4 py-3 rounded shadow
                        text-white
                        ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
                    `}
                >
                    {notification.message}
                </div>
            )}

            <div className="p-4 bg-white shadow rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <img
                        src={product.image || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-auto rounded"
                    />
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                        <p className="text-gray-600 mb-2">
                            <span className="font-semibold">Category:</span> {product.category}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <span className="font-semibold">Price:</span> ${product.price}
                        </p>

                        <button
                            className={`mt-3 px-4 py-2 rounded transition-colors 
                                ${
                                    isInCart ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                                }
                                text-white 
                            `}
                            onClick={handleAddToCart}
                            disabled={isInCart}
                        >
                            {isInCart ? 'Added to Cart' : 'Add to Cart'}
                        </button>

                        <p className="mt-4 text-gray-700">{product.description}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 shadow rounded-md">
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map(rev => (
                            <div key={rev.id} className="p-3 border-b last:border-none">
                                <p className="font-semibold">{rev.user}</p>
                                <p>
                                    Rating: <span className="text-yellow-500">{'★'.repeat(rev.rating)}</span>
                                </p>
                                <p>{rev.text}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6">
                    <textarea
                        className="border w-full p-2 mb-2 rounded"
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                    />
                    <select
                        className="border p-2 mb-2 rounded"
                        value={rating}
                        onChange={e => setRating(Number(e.target.value))}
                    >
                        {[5, 4, 3, 2, 1].map(r => (
                            <option key={r} value={r}>
                                {r} Star{r > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                    <button
                        className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={submitReview}
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </Layout>
    );
}
