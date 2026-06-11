import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { getCurrentUser, login as loginService, logout as logoutService } from "../services/authService";

export interface User {
    name: string;
    role?: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isCustomer: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<unknown>;
    logout: () => void;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => getCurrentUser());
    const [loading] = useState(false);

    const refreshUser = () => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    };

    const login = async (username: string, password: string) => {
        const data = await loginService(username, password);
        refreshUser();
        return data;
    };

    const logout = () => {
        logoutService();
        setUser(null);
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === "Admin";
    const isCustomer = user?.role === "Customer";

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isAdmin,
                isCustomer,
                loading,
                login,
                logout,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}
