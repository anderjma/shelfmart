// This file integrates the login, session management, and token decoding operations on the frontend.
import axiosClient from "../../../lib/api-client";
import { jwtDecode } from "jwt-decode";

interface UserFormData {
    name: string;
    username: string;
    email: string;
    password?: string;
}

interface DecodedToken {
    role?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
    name?: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
    unique_name?: string;
    username?: string;
    sub?: string;
    exp?: number;
}

// This function sends the credentials to the backend and locally stores the access token if they are valid.
export const login = async (username: string, password: string) => {
    const response = await axiosClient.post("/Auth/login", { username, password });
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
};

// This function destroys the current session by removing the token stored in the browser.
export const logout = () => {
    localStorage.removeItem("token");
};

// This function decodes the active session token to extract and return the current user's information.
export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);

        // Check whether the token has expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            return null;
        }

        const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const name = decoded.name || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "User";

        // This line extracts the username from .NET's standard claims.
        const username = decoded.unique_name || decoded.username || decoded.sub || name;

        return { name, role, username };
    } catch {
        return null;
    }
};

// This function processes the registration form to onboard a new user onto the platform.
export const registerCustomer = async (data: UserFormData) => {
    const response = await axiosClient.post('/Customers/register', data);
    return response.data;
};
