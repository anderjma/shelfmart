// Este archivo declara las interfaces para garantizar la seguridad de tipos en el catálogo de productos.
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

// Esta interfaz establece los datos de entrada mínimos requeridos para crear o modificar un producto.
export interface ProductFormData {
    name: string;
    category: string;
    stock: number;
    price: number;
    imageUrl: string;
    discountPercentage: number;
}
