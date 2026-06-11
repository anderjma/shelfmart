// Este archivo coordina las integraciones RESTFUL para el control de inventario de productos.
import axiosClient from "../api/axiosClient";
import type { Product, ProductFormData } from "../types/product";
import { sanitizeImageUrl } from "../lib/sanitizeImageUrl";

// Esta función extrae todo el catálogo disponible desde el backend para operaciones administrativas.
export const getProducts = async () => {
    const response = await axiosClient.get<Product[]>("/Products");
    return response.data.map(p => ({
        ...p,
        imageUrl: sanitizeImageUrl(p.imageUrl),
    }));
};

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
