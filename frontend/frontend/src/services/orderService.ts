// Este archivo provee los métodos de comunicación HTTP para administrar los carritos de compras y realizar el checkout.
import axiosClient from "../api/axiosClient";

// Esta función obtiene el estado actual del carrito de compras asociado a la sesión del usuario.
export const getCart = async () => {
    const response = await axiosClient.get("/Orders/cart");
    return response.data;
};

// Esta función envía una solicitud para agregar un artículo nuevo o incrementar su cantidad en el carrito.
export const addToCart = async (data: { productId: string; quantity: number }) => {
    const response = await axiosClient.post("/Orders/cart/items", data);
    return response.data;
};

// Esta función finaliza la compra del carrito actual, confirmando el pedido en el servidor.
export const checkout = async () => {
    const response = await axiosClient.post("/Orders/checkout", {});
    return response.data;
};

// Esta función recupera una lista administrativa de todas las órdenes procesadas por el negocio.
export const getAllOrders = async () => {
    const response = await axiosClient.get("/Orders/all");
    return response.data;
};

// Esta función busca de manera exclusiva el historial de compras del cliente que actualmente ha iniciado sesión.
export const getMyOrders = async () => {
    const response = await axiosClient.get("/Orders/my-orders");
    return response.data;
};
