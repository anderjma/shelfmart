import axiosClient from "../api/axiosClient";
import type { Cart, AddToCartDto } from "../types/order";

export const getCart = async () => {
    const response = await axiosClient.get<Cart>("/Orders/cart");
    return response.data;
};

export const addToCart = async (data: AddToCartDto) => {
    const response = await axiosClient.post<Cart>("/Orders/cart/items", data);
    return response.data;
};

export const checkout = async () => {
    const response = await axiosClient.post("/Orders/checkout");
    return response.data;
};
