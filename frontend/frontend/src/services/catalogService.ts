import axiosClient from "../api/axiosClient";
import type { Product } from "../types/product";

export const getPublicProducts = async () => {
    const response = await axiosClient.get<Product[]>("/Catalog");
    return response.data;
};
