// This file provides the HTTP communication methods for managing shopping carts and performing checkout.
import axiosClient from "../../../lib/api-client";

// This function retrieves the current state of the shopping cart associated with the user's session.
export const getCart = async () => {
    const response = await axiosClient.get("/Orders/cart");
    return response.data;
};

// This function sends a request to add a new item or increase its quantity in the cart.
export const addToCart = async (data: { productId: string; quantity: number }) => {
    const response = await axiosClient.post("/Orders/cart/items", data);
    return response.data;
};

// This function updates the quantity of an existing item in the cart.
export const updateCartItemQuantity = async (productId: string, quantity: number) => {
    const response = await axiosClient.put(`/Orders/cart/items/${productId}`, { quantity });
    return response.data;
};

// This function completely removes an item from the cart.
export const removeFromCart = async (productId: string) => {
    const response = await axiosClient.delete(`/Orders/cart/items/${productId}`);
    return response.data;
};

// This function finalizes the current cart's purchase, confirming the order on the server.
export const checkout = async () => {
    const response = await axiosClient.post("/Orders/checkout", {});
    return response.data;
};

// This function exclusively retrieves the purchase history of the currently logged-in customer.
export const getMyOrders = async () => {
    const response = await axiosClient.get("/Orders/my-orders");
    return response.data;
};
