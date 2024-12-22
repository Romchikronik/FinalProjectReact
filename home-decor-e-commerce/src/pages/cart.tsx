import React from 'react';
import Layout from '@/components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeFromCart, changeQuantity, clearCart } from '@/store/slices/cartSlice';
import Link from 'next/link';

export default function CartPage() {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();

    const handleRemove = (id: number) => {
        dispatch(removeFromCart(id));
    };

    const handleChangeQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;
        dispatch(changeQuantity({ id, quantity }));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

            {cartItems.length === 0 ? (
                <p className="text-gray-700">Your cart is empty.</p>
            ) : (
                <div className="font-lora space-y-6">
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div
                                key={item.id}
                                className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded shadow-sm bg-white"
                            >
                                <img
                                    src={item.image || '/placeholder.jpg'}
                                    alt={`${item.name} image`}
                                    className="w-full md:w-32 h-32 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-lg">{item.name}</p>
                                    <p className="text-gray-600">Price: ${item.price}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <label htmlFor={`qty-${item.id}`} className="text-sm">
                                            Quantity:
                                        </label>
                                        <input
                                            id={`qty-${item.id}`}
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            onChange={e => handleChangeQuantity(item.id, Number(e.target.value))}
                                            className="border px-2 py-1 w-20 rounded"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border rounded shadow-sm bg-white text-right">
                        <p className="text-xl font-semibold mb-4">
                            Total: ${total.toFixed(2)}
                        </p>
                        <div className="space-x-2">
                            <Link
                                href="/checkout"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Proceed to Checkout
                            </Link>
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                onClick={handleClearCart}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
