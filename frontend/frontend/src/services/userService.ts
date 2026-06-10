// Este archivo aloja los puentes de comunicación asíncrona hacia los endpoints de gestión de usuarios.
import axiosClient from "../api/axiosClient";
import type { User, UserFormData } from "../types/user";

// Esta función lee el directorio completo de cuentas registradas en la plataforma.
export const getUsers = async () => {
    const response = await axiosClient.get<User[]>("/Users");
    return response.data;
};

// Esta función invoca la API para dar de alta a un usuario nuevo empleando la estructura de datos requerida.
export const createUser = async (data: UserFormData) => {
    const response = await axiosClient.post<User>("/Users", data);
    return response.data;
};
