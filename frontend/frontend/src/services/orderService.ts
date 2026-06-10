// Este archivo provee los métodos de comunicación HTTP para administrar los carritos de compras y realizar el checkout.
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/Orders`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

// Esta función obtiene el estado actual del carrito de compras asociado a la sesión del usuario.
export const getCart = async () => {
    const response = await axios.get(`${API_URL}/cart`, getAuthHeaders());
    return response.data;
};

// Esta función envía una solicitud para agregar un artículo nuevo o incrementar su cantidad en el carrito.
export const addToCart = async (data: { productId: string; quantity: number }) => {
    const response = await axios.post(`${API_URL}/cart/items`, data, getAuthHeaders());
    return response.data;
};

// Esta función finaliza la compra del carrito actual, confirmando el pedido en el servidor.
export const checkout = async () => {
    const response = await axios.post(`${API_URL}/checkout`, {}, getAuthHeaders());
    return response.data;
};

// Esta función recupera una lista administrativa de todas las órdenes procesadas por el negocio.
export const getAllOrders = async () => {
    const response = await axios.get(`${API_URL}/all`, getAuthHeaders());
    return response.data;
};

// Esta función busca de manera exclusiva el historial de compras del cliente que actualmente ha iniciado sesión.
export const getMyOrders = async () => {
    const response = await axios.get(`${API_URL}/my-orders`, getAuthHeaders());
    return response.data;
};
