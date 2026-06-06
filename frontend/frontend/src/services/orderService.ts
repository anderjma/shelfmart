import axios from "axios";

const API_URL = "http://localhost:5000/api/Orders";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const getCart = async () => {
    const response = await axios.get(`${API_URL}/cart`, getAuthHeaders());
    return response.data;
};

export const addToCart = async (data: { productId: string; quantity: number }) => {
    const response = await axios.post(`${API_URL}/cart/items`, data, getAuthHeaders());
    return response.data;
};

export const checkout = async () => {
    const response = await axios.post(`${API_URL}/checkout`, {}, getAuthHeaders());
    return response.data;
};

export const getAllOrders = async () => {
    const response = await axios.get(`${API_URL}/all`, getAuthHeaders());
    return response.data;
};

export const getMyOrders = async () => {
    const response = await axios.get(`${API_URL}/my-orders`, getAuthHeaders());
    return response.data;
};
