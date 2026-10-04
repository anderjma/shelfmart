// This file coordinates the RESTful integration for the category reference catalog.
import axiosClient from "../../../../lib/api-client";

export interface Category {
    categoryId: string;
    name: string;
}

export async function getCategories(): Promise<Category[]> {
    const response = await axiosClient.get("/Categories");
    return response.data;
}

export async function createCategory(name: string): Promise<Category> {
    const response = await axiosClient.post("/Categories", { name });
    return response.data;
}
