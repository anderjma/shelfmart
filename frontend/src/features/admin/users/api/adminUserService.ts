// This file coordinates the RESTful integrations for admin user management.
import axiosClient from "../../../../lib/api-client";

export type UserRole = "Admin" | "Customer";

export interface AdminUser {
    userResourceId: string;
    name: string;
    username: string;
    email: string;
    role: UserRole;
}

export async function getUsers(): Promise<AdminUser[]> {
    const response = await axiosClient.get("/Users");
    return response.data;
}

export async function updateUserRole(userId: string, role: UserRole): Promise<AdminUser> {
    const response = await axiosClient.put(`/Users/${userId}/role`, { role });
    return response.data;
}
