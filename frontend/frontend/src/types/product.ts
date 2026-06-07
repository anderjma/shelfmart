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

export interface ProductFormData {
    name: string;
    category: string;
    stock: number;
    price: number;
    imageUrl: string;
    discountPercentage: number;
}
