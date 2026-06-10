// Este archivo maneja las peticiones HTTP relacionadas con la consulta pública del catálogo.
import axiosClient from "../api/axiosClient";
import type { Product } from "../types/product";

// Esta función recupera la lista de productos disponibles para ser mostrados a usuarios no autenticados.
export const getPublicProducts = async () => {
    const response = await axiosClient.get<Product[]>("/Catalog");
    return response.data;
};
