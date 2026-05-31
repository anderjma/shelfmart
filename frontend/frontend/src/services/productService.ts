import axiosClient from "../api/axiosClient";
import type { Product, ProductFormData } from "../types/product";

export const getProducts = async () => {
    const response = await axiosClient.get<Product[]>("/Products");
    return response.data;
};

export const createProduct = async (data: ProductFormData) => {
    const response = await axiosClient.post<Product>("/Products", data);
    return response.data;
};

export const updateProduct = async (id: string, data: ProductFormData) => {
    const response = await axiosClient.put<Product>(`/Products/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id: string) => {
    await axiosClient.delete(`/Products/${id}`);
};
