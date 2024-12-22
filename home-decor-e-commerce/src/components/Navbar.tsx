import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const Navbar: React.FC = () => {
    // Example: Display the total cart count from Redux state
    const cartItemsCount = useSelector((state: RootState) =>
        state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
    );

    return (
        <nav className="flex items-center justify-between p-4 bg-gray-200">
            <Link href="/">
                <span className="font-bold text-xl cursor-pointer">Home Decor</span>
            </Link>
            <div className="space-x-4">
                <Link href="/products">
                    <span className="cursor-pointer hover:underline">Products</span>
                </Link>
                <Link href="/cart">
                    <span className="cursor-pointer hover:underline">
                        Cart ({cartItemsCount})
                    </span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;


