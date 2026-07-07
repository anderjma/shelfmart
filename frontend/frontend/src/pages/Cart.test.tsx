import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Cart from "./Cart";
import { getCart, checkout, updateCartItemQuantity, removeFromCart } from "../services/orderService";

vi.mock("../services/orderService", () => ({
    getCart: vi.fn(),
    checkout: vi.fn(),
    updateCartItemQuantity: vi.fn(),
    removeFromCart: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Cart Page Component", () => {
    const mockCart = {
        orderId: "order-123",
        totalAmount: 1500,
        items: [
            {
                productId: "prod-1",
                productName: "Producto Premium A",
                quantity: 2,
                unitPrice: 500,
                subTotal: 1000,
            },
            {
                productId: "prod-2",
                productName: "Producto Basic B",
                quantity: 1,
                unitPrice: 500,
                subTotal: 500,
            }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        window.confirm = vi.fn().mockReturnValue(true);
    });

    test("renders loading state initially", async () => {
        vi.mocked(getCart).mockImplementation(() => new Promise(() => {})); // hung promise
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );
        expect(screen.getByText("Cargando carrito...")).toBeInTheDocument();
    });

    test("renders empty cart state when no items are present", async () => {
        vi.mocked(getCart).mockResolvedValue({ orderId: "1", totalAmount: 0, items: [] });
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Su carrito está vacío")).toBeInTheDocument();
        });

        const backBtn = screen.getByText("Volver al catálogo");
        fireEvent.click(backBtn);
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    test("renders cart items and total correctly", async () => {
        vi.mocked(getCart).mockResolvedValue(mockCart);
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Producto Premium A").length).toBeGreaterThan(0);
            expect(screen.getAllByText("Producto Basic B").length).toBeGreaterThan(0);
            expect(screen.getAllByText(/1500/).length).toBeGreaterThan(0);
        });
    });

    test("handles quantity update (increase)", async () => {
        vi.mocked(getCart).mockResolvedValue(mockCart);
        vi.mocked(updateCartItemQuantity).mockResolvedValue({
            ...mockCart,
            totalAmount: 2000,
            items: [
                { ...mockCart.items[0], quantity: 3, subTotal: 1500 },
                mockCart.items[1]
            ]
        });

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Producto Premium A").length).toBeGreaterThan(0);
        });

        // Click the first plus button (desktops list)
        const plusButtons = screen.getAllByTitle("Aumentar cantidad");
        fireEvent.click(plusButtons[0]);

        expect(updateCartItemQuantity).toHaveBeenCalledWith("prod-1", 3);

        await waitFor(() => {
            expect(screen.getAllByText(/2000/).length).toBeGreaterThan(0);
        });
    });

    test("handles quantity update (decrease)", async () => {
        vi.mocked(getCart).mockResolvedValue(mockCart);
        vi.mocked(updateCartItemQuantity).mockResolvedValue({
            ...mockCart,
            totalAmount: 1000,
            items: [
                { ...mockCart.items[0], quantity: 1, subTotal: 500 },
                mockCart.items[1]
            ]
        });

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Producto Premium A").length).toBeGreaterThan(0);
        });

        // Click the first minus button (desktops list)
        const minusButtons = screen.getAllByTitle("Reducir cantidad");
        fireEvent.click(minusButtons[0]);

        expect(updateCartItemQuantity).toHaveBeenCalledWith("prod-1", 1);
    });

    test("handles delete cart item", async () => {
        vi.mocked(getCart).mockResolvedValue(mockCart);
        vi.mocked(removeFromCart).mockResolvedValue({
            ...mockCart,
            totalAmount: 500,
            items: [mockCart.items[1]]
        });

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Producto Premium A").length).toBeGreaterThan(0);
        });

        // Click the first delete button (desktops list)
        const deleteButtons = screen.getAllByTitle("Eliminar producto");
        fireEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(removeFromCart).toHaveBeenCalledWith("prod-1");

        await waitFor(() => {
            expect(screen.queryAllByText("Producto Premium A").length).toBe(0);
            expect(screen.getAllByText(/500/).length).toBeGreaterThan(0);
        });
    });

    test("handles checkout action correctly", async () => {
        vi.mocked(getCart).mockResolvedValue(mockCart);
        vi.mocked(checkout).mockResolvedValue({ orderId: "order-123", status: "Completed" });

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Producto Premium A").length).toBeGreaterThan(0);
        });

        const checkoutBtn = screen.getByText("Finalizar Compra");
        fireEvent.click(checkoutBtn);

        expect(window.confirm).toHaveBeenCalledWith("¿Desea confirmar su compra?");
        expect(checkout).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });
});
