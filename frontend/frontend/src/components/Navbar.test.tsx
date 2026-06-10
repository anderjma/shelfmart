import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { getCurrentUser, logout } from "../services/authService";

// Esta instrucción simula las funciones del servicio de autenticación.
vi.mock("../services/authService", () => ({
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
}));

// Esta instrucción simula la función useNavigate de react-router-dom.
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
        vi.mocked(getCurrentUser).mockReturnValue(null);

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Esta validación comprueba la visualización de enlaces públicos.
        expect(screen.getByText("Entrar")).toBeInTheDocument();
        expect(screen.getByText("Crear Cuenta")).toBeInTheDocument();
        
        // Esta validación comprueba la ocultación de enlaces restringidos.
        expect(screen.queryByText("Panel Admin")).not.toBeInTheDocument();
        expect(screen.queryByLabelText("Ver carrito")).not.toBeInTheDocument();
    });

    test("renders correctly for an Admin user", () => {
        vi.mocked(getCurrentUser).mockReturnValue({
            name: "Administrador Pepe",
            role: "Admin",
            username: "adminpepe"
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Esta validación comprueba la visualización de la interfaz de administrador.
        expect(screen.getByText("Administrador Pepe")).toBeInTheDocument();
        expect(screen.getByText("Panel Admin")).toBeInTheDocument();

        // Esta validación comprueba la ocultación de enlaces públicos al autenticarse.
        expect(screen.queryByText("Entrar")).not.toBeInTheDocument();
        expect(screen.queryByText("Crear Cuenta")).not.toBeInTheDocument();
        
        // Esta validación comprueba la ocultación del carrito para administradores.
        expect(screen.queryByLabelText("Ver carrito")).not.toBeInTheDocument();
    });

    test("renders correctly for a Customer user", () => {
        vi.mocked(getCurrentUser).mockReturnValue({
            name: "Cliente Juan",
            role: "Customer",
            username: "juanito"
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Esta validación comprueba la visualización de elementos del cliente.
        expect(screen.getByText("Cliente Juan")).toBeInTheDocument();
        expect(screen.getByLabelText("Ver carrito")).toBeInTheDocument();

        // Esta validación comprueba la ocultación del panel de administración para clientes.
        expect(screen.queryByText("Panel Admin")).not.toBeInTheDocument();
    });

    test("handles logout click correctly", () => {
        vi.mocked(getCurrentUser).mockReturnValue({
            name: "Usuario Activo",
            role: "Customer",
            username: "activo"
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Esta acción simula el click en el botón de cierre de sesión.
        const logoutBtn = screen.getByTitle("Cerrar sesión");
        fireEvent.click(logoutBtn);

        // Esta validación comprueba que el sistema cierre la sesión y redirija al usuario.
        expect(logout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
