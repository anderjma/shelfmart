import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { getCurrentUser, login as loginService, logout as logoutService } from "../features/auth/api/authService";

export interface User {
    name: string;
    role?: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isCustomer: boolean;
    isAdmin: boolean;
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
    const isCustomer = user?.role === "Customer";
    const isAdmin = user?.role === "Admin";

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isCustomer,
                isAdmin,
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
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
