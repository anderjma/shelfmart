import axiosClient from "../api/axiosClient";
import type { User } from "../types/user";

export const getUsers = async () => {
    const response = await axiosClient.get<User[]>("/Users");
    return response.data;
};
