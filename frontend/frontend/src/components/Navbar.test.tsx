import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";

const mockLogout = vi.fn();
// Esta instrucción simula el hook de autenticación.
vi.mock("../contexts/AuthContext", () => ({
    useAuth: vi.fn(),
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
        vi.mocked(useAuth).mockReturnValue({
            user: null,
            isAuthenticated: false,
            isCustomer: false,
            loading: false,
            login: vi.fn(),
            logout: mockLogout,
            refreshUser: vi.fn(),
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Esta validación comprueba la visualización de enlaces públicos.
        expect(screen.getByText("Entrar")).toBeInTheDocument();
        expect(screen.getByText("Crear Cuenta")).toBeInTheDocument();
        
        // Esta validación comprueba la ocultación de enlaces restringidos.
        expect(screen.queryByText(/Panel de Administración/)).not.toBeInTheDocument();
        expect(screen.queryByLabelText("Ver carrito")).not.toBeInTheDocument();
    });

    test("renders correctly for an Admin user", () => {
        vi.mocked(useAuth).mockReturnValue({
            user: {
                name: "Administrador Pepe",
                role: "Admin",
                username: "adminpepe"
            },
            isAuthenticated: true,
            isCustomer: false,
            loading: false,
            login: vi.fn(),
            logout: mockLogout,
            refreshUser: vi.fn(),
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // El panel de administración fue removido del frontend web; la gestión es via app MAUI.
        expect(screen.getByText("Administrador Pepe")).toBeInTheDocument();
        expect(screen.queryByText(/Panel de Administración/)).not.toBeInTheDocument();

        // Esta validación comprueba la ocultación de enlaces públicos al autenticarse.
        expect(screen.queryByText("Entrar")).not.toBeInTheDocument();
        expect(screen.queryByText("Crear Cuenta")).not.toBeInTheDocument();

        // Esta validación comprueba la ocultación del carrito para administradores.
        expect(screen.queryByLabelText("Ver carrito")).not.toBeInTheDocument();
    });

    test("renders correctly for a Customer user", () => {
        vi.mocked(useAuth).mockReturnValue({
            user: {
                name: "Cliente Juan",
                role: "Customer",
                username: "juanito"
            },
            isAuthenticated: true,
            isCustomer: true,
            loading: false,
            login: vi.fn(),
            logout: mockLogout,
            refreshUser: vi.fn(),
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
        expect(screen.queryByText(/Panel de Administración/)).not.toBeInTheDocument();
    });

    test("handles logout click correctly", () => {
        vi.mocked(useAuth).mockReturnValue({
            user: {
                name: "Usuario Activo",
                role: "Customer",
                username: "activo"
            },
            isAuthenticated: true,
            isCustomer: true,
            loading: false,
            login: vi.fn(),
            logout: mockLogout,
            refreshUser: vi.fn(),
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
        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
