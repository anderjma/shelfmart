// Este archivo coordina las integraciones RESTFUL para el control de inventario de productos.
import axiosClient from "../api/axiosClient";
import type { Product, ProductFormData } from "../types/product";
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

// Esta función registra un artículo nuevo dentro de la base de datos de productos del sistema.
export const createProduct = async (data: ProductFormData) => {
    const sanitized = { ...data, imageUrl: sanitizeImageUrl(data.imageUrl) };
    const response = await axiosClient.post<Product>("/Products", sanitized);
    return response.data;
};

// Esta función sobreescribe las características de un producto existente basándose en los datos proveídos.
export const updateProduct = async (id: string, data: ProductFormData) => {
    const sanitized = { ...data, imageUrl: sanitizeImageUrl(data.imageUrl) };
    const response = await axiosClient.put<Product>(`/Products/${id}`, sanitized);
    return response.data;
};

// Esta función se comunica con la API para borrar permanentemente un producto específico.
export const deleteProduct = async (id: string) => {
    await axiosClient.delete(`/Products/${id}`);
};
