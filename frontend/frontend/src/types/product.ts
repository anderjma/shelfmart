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
