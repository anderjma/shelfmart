// This file coordinates the RESTful integrations for product inventory control.
import axiosClient from "../../../lib/api-client";
import type { Product } from "../types";
import { sanitizeImageUrl } from "../../../shared/utils/sanitizeImageUrl";

export interface PaginatedProducts {
    items: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// This function retrieves the available catalog from the backend, either paginated or in full.
export function getProducts(params: { page: number; pageSize?: number; search?: string; category?: string }): Promise<PaginatedProducts>;
export function getProducts(params?: { page?: undefined; pageSize?: number; search?: string; category?: string }): Promise<Product[]>;
export async function getProducts(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
}): Promise<PaginatedProducts | Product[]> {
    const response = await axiosClient.get("/Products", { params });
    
    // If the response comes structured with pagination
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

    // Direct response as an array
    const products = response.data as Product[];
    return products.map(p => ({
        ...p,
        imageUrl: sanitizeImageUrl(p.imageUrl),
    }));
}

