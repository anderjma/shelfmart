export interface Product {
    productResourceId: string;
    name: string;
    stock: number;
    price: number;
    imageUrl?: string;
    category: string;
}

export interface ProductFormData {
    name: string;
    stock: number;
    price: number;
    imageUrl?: string;
    category: string;
}
