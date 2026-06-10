// Este archivo integra las operaciones de inicio de sesión, manejo de sesión y decodificación de tokens en el frontend.
import axiosClient from "../api/axiosClient";
import { jwtDecode } from "jwt-decode";
import type { UserFormData } from "../types/user";

interface DecodedToken {
    role?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
    name?: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
    unique_name?: string;
    username?: string;
    sub?: string;
}

// Esta función envía las credenciales al backend y almacena localmente el token de acceso si resultan válidas.
export const login = async (username: string, password: string) => {
    const response = await axiosClient.post("/Auth/login", { username, password });
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
};

// Esta función destruye la sesión actual eliminando el token almacenado en el navegador.
export const logout = () => {
    localStorage.removeItem("token");
};

// Esta función decodifica el token de sesión activo para extraer y devolver la información del usuario en uso.
export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const name = decoded.name || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Usuario";
        
        // Esta línea extrae el nombre de usuario de las aserciones estándar de .NET.
        const username = decoded.unique_name || decoded.username || decoded.sub || name;
        
        return { name, role, username };
    } catch {
        return null;
    }
};

// Esta función procesa el formulario de registro para incorporar a un nuevo usuario en la plataforma.
export const registerCustomer = async (data: UserFormData) => {
    const response = await axiosClient.post('/Customers/register', data);
    return response.data;
};
