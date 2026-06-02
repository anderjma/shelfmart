export interface Product {
    productId: string;
    productResourceId: string;
    name: string;
    stock: number;
    price: number;
    imageUrl?: string;
}

export interface ProductFormData {
    name: string;
    stock: number;
    price: number;
    imageUrl?: string;
}
