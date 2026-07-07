// This file declares the interfaces to ensure type safety in the product catalog.
export interface Product {
    productResourceId: string;
    name: string;
    stock: number;
    price: number;
    imageUrl?: string;
    category: string;
    discountPercentage: number;
    createdAt: string;
}
