import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { getCurrentUser, logout } from "../services/authService";

// Mocking the authService functions
vi.mock("../services/authService", () => ({
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
}));

// Mocking react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Navbar Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders correctly for a guest user (unauthenticated)", () => {
        (getCurrentUser as any).mockReturnValue(null);

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Debería ver "Entrar" y "Crear Cuenta"
        expect(screen.getByText("Entrar")).toBeInTheDocument();
        expect(screen.getByText("Crear Cuenta")).toBeInTheDocument();
        
        // No debería ver enlaces restringidos
        expect(screen.queryByText("Panel Admin")).not.toBeInTheDocument();
        expect(screen.queryByLabelText("Ver carrito")).not.toBeInTheDocument();
    });

    test("renders correctly for an Admin user", () => {
        (getCurrentUser as any).mockReturnValue({
            name: "Administrador Pepe",
            role: "Admin",
            username: "adminpepe"
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Debería ver el nombre y "Panel Admin"
        expect(screen.getByText("Administrador Pepe")).toBeInTheDocument();
        expect(screen.getByText("Panel Admin")).toBeInTheDocument();

        // No debería ver "Entrar" o "Crear Cuenta"
        expect(screen.queryByText("Entrar")).not.toBeInTheDocument();
        expect(screen.queryByText("Crear Cuenta")).not.toBeInTheDocument();
        
        // No debería ver el carrito
        expect(screen.queryByLabelText("Ver carrito")).not.toBeInTheDocument();
    });

    test("renders correctly for a Customer user", () => {
        (getCurrentUser as any).mockReturnValue({
            name: "Cliente Juan",
            role: "Customer",
            username: "juanito"
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Debería ver el nombre y el ícono/enlace del carrito
        expect(screen.getByText("Cliente Juan")).toBeInTheDocument();
        expect(screen.getByLabelText("Ver carrito")).toBeInTheDocument();

        // No debería ver "Panel Admin"
        expect(screen.queryByText("Panel Admin")).not.toBeInTheDocument();
    });

    test("handles logout click correctly", () => {
        (getCurrentUser as any).mockReturnValue({
            name: "Usuario Activo",
            role: "Customer",
            username: "activo"
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Hacer click en el botón de logout (el que tiene el title "Cerrar sesión")
        const logoutBtn = screen.getByTitle("Cerrar sesión");
        fireEvent.click(logoutBtn);

        // Verificar que llame a logout y redirija
        expect(logout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
