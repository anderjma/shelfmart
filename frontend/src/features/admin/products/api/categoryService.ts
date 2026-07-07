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
