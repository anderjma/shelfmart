// Este archivo coordina las integraciones RESTFUL para el control de inventario de productos.
import axiosClient from "../api/axiosClient";
import type { Product } from "../types/product";
import { sanitizeImageUrl } from "../lib/sanitizeImageUrl";

export interface PaginatedProducts {
    items: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Esta función extrae el catálogo disponible desde el backend de forma paginada o completa.
export function getProducts(params: { page: number; pageSize?: number; search?: string; category?: string }): Promise<PaginatedProducts>;
export function getProducts(params?: { page?: undefined; pageSize?: number; search?: string; category?: string }): Promise<Product[]>;
export async function getProducts(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
}): Promise<PaginatedProducts | Product[]> {
    const response = await axiosClient.get("/Products", { params });
    
    // Si la respuesta viene estructurada con paginación
    if (response.data && typeof response.data === "object" && "items" in response.data) {
        const paginated = response.data as PaginatedProducts;
        return {
            ...paginated,
            items: paginated.items.map(p => ({
                ...p,
                imageUrl: sanitizeImageUrl(p.imageUrl),
            }))
        };
    }

    // Respuesta directa como array
    const products = response.data as Product[];
    return products.map(p => ({
        ...p,
        imageUrl: sanitizeImageUrl(p.imageUrl),
    }));
}

