export interface Product {
    productResourceId: string;
    name: string;
    stock: number;
    price: number;
}

export interface ProductFormData {
    name: string;
    stock: number;
    price: number;
}
