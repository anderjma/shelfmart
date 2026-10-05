// This file coordinates the RESTful integrations for admin product management (create, update, soft delete).
import axiosClient from "../../../../lib/api-client";
import type { Product } from "../../../store/types";
import { sanitizeImageUrl } from "../../../../shared/utils/sanitizeImageUrl";

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

// Uploads a local image file. If client-side Supabase credentials are configured (e.g. in Vercel),
// it uploads directly to Supabase Storage; otherwise, it delegates to the backend endpoint.
async function uploadDirectToSupabase(file: File, supabaseUrl: string, supabaseAnonKey: string): Promise<string> {
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const cleanBaseUrl = supabaseUrl.replace(/\/+$/, "");
    const uploadUrl = sanitizeImageUrl(`${cleanBaseUrl}/storage/v1/object/product-images/${fileName}`);

    const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            apikey: supabaseAnonKey,
            "x-upsert": "false"
        },
        body: file
    });

    if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({ message: uploadRes.statusText }));
        throw new Error(err.message || uploadRes.statusText);
    }

    return sanitizeImageUrl(`${cleanBaseUrl}/storage/v1/object/public/product-images/${fileName}`);
}

export async function uploadProductImage(file: File): Promise<string> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
        try {
            return await uploadDirectToSupabase(file, supabaseUrl, supabaseAnonKey);
        } catch (directErr) {
            console.warn("Direct Supabase upload failed, trying backend endpoint:", directErr);
        }
    }

    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosClient.post<{ url: string }>("/product-images", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data.url;
}
