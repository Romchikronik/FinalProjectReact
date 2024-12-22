import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="font-lora border rounded shadow-sm bg-white p-4 hover:shadow-md transition-shadow">
            <img
                src={product.image || '/placeholder.jpg'}
                alt={`${product.name} image`}
                className="w-full h-48 object-cover rounded mb-3"
            />
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-gray-700 mb-2">${product.price}</p>
            <Link href={`/products/${product.id}`}>
                <span className="text-blue-500 hover:underline cursor-pointer">
                  View Details
                </span>
            </Link>
        </div>
    );
};

export default ProductCard;
