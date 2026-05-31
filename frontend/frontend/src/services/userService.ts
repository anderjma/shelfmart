import axiosClient from "../api/axiosClient";
import type { User, UserFormData } from "../types/user";

export const getUsers = async () => {
    const response = await axiosClient.get<User[]>("/Users");
    return response.data;
};

export const createUser = async (data: UserFormData) => {
    const response = await axiosClient.post<User>("/Users", data);
    return response.data;
};
