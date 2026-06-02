import axiosClient from "../api/axiosClient";
import { jwtDecode } from "jwt-decode";

export const login = async (username: string, password: string) => {
    const response = await axiosClient.post("/Auth/login", { username, password });
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
};

export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    try {
        const decoded: any = jwtDecode(token);
        const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const name = decoded.name || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Usuario";
        
        return { name, role };
    } catch {
        return null;
    }
};

export const registerCustomer = async (data: any) => {
    const response = await axiosClient.post('/Customers/register', data);
    return response.data;
};

