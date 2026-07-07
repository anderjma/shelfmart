// This file coordinates the RESTful integration for the admin dashboard metrics.
import axiosClient from "../../../../lib/api-client";

export interface SalesChartPoint {
    date: string;
    total: number;
}

export interface DashboardStats {
    revenue: number;
    orders: number;
    lowStock: number;
    totalCustomers: number;
    salesChart: SalesChartPoint[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await axiosClient.get("/Audit/stats");
    return response.data;
}
