export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
    image?: string;
}

export interface Review {
    id: number;
    user: string;
    text: string;
    rating: number;
    productId: number;
}
