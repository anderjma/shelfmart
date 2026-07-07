// This file coordinates the RESTful integrations for admin product management (create, update, soft delete).
import axiosClient from "../../../../lib/api-client";
import type { Product } from "../../../store/types";

export interface ProductPayload {
    name: string;
    stock: number;
    price: number;
    imageUrl?: string;
    category: string;
    discountPercentage: number;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
    const response = await axiosClient.post("/Products", payload);
    return response.data;
}

export async function updateProduct(id: string, payload: ProductPayload): Promise<Product> {
    const response = await axiosClient.put(`/Products/${id}`, payload);
    return response.data;
}

// Soft delete: the backend deactivates the product (IsActive = false) instead of removing it.
export async function deleteProduct(id: string): Promise<void> {
    await axiosClient.delete(`/Products/${id}`);
}
