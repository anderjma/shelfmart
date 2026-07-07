// This file coordinates the RESTful integrations for admin order listing and status updates.
import axiosClient from "../../../../lib/api-client";

export type OrderStatus = "Cart" | "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export interface AdminOrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
}

export interface AdminOrder {
    orderId: string;
    customerUsername: string;
    totalAmount: number;
    status: OrderStatus;
    items: AdminOrderItem[];
}

export async function getAllOrders(): Promise<AdminOrder[]> {
    const response = await axiosClient.get("/Orders/all");
    return response.data;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<AdminOrder> {
    const response = await axiosClient.put(`/Orders/${orderId}/status`, { status });
    return response.data;
}
