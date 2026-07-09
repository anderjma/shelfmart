import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Cart from "./Cart";

const { mockGetCart, mockCheckout, mockUpdateCartItemQuantity, mockRemoveFromCart, mockNavigate } = vi.hoisted(() => ({
    mockGetCart: vi.fn(),
    mockCheckout: vi.fn(),
    mockUpdateCartItemQuantity: vi.fn(),
    mockRemoveFromCart: vi.fn(),
    mockNavigate: vi.fn()
}));

vi.mock("../api/orderService", () => ({
    getCart: mockGetCart,
    checkout: mockCheckout,
    updateCartItemQuantity: mockUpdateCartItemQuantity,
    removeFromCart: mockRemoveFromCart
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

const sampleCart = {
    orderId: "order-1",
    totalAmount: 200,
    items: [
        { productId: "p1", productName: "Widget", quantity: 2, unitPrice: 100, subTotal: 200 }
    ]
};

function renderCart() {
    return render(
        <MemoryRouter>
            <Cart />
        </MemoryRouter>
    );
}

describe("Cart", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the cart items and total once loaded", async () => {
        mockGetCart.mockResolvedValue(sampleCart);

        renderCart();

        expect((await screen.findAllByText("Widget"))[0]).toBeInTheDocument();
        expect(screen.getAllByText(/200,00/)[0]).toBeInTheDocument();
    });

    it("shows the empty state when the cart has no items", async () => {
        mockGetCart.mockResolvedValue({ orderId: "order-1", totalAmount: 0, items: [] });

        renderCart();

        expect(await screen.findByText("Your cart is empty")).toBeInTheDocument();
    });

    it("increases the quantity of an item without asking for confirmation", async () => {
        mockGetCart.mockResolvedValue(sampleCart);
        mockUpdateCartItemQuantity.mockResolvedValue({
            ...sampleCart,
            items: [{ ...sampleCart.items[0], quantity: 3, subTotal: 300 }]
        });

        renderCart();
        await screen.findAllByText("Widget");

        fireEvent.click(screen.getAllByLabelText("Increase quantity of Widget")[0]);

        await waitFor(() => {
            expect(mockUpdateCartItemQuantity).toHaveBeenCalledWith("p1", 3);
        });
    });

    it("asks for confirmation before removing an item, and only calls the API after confirming", async () => {
        mockGetCart.mockResolvedValue(sampleCart);
        mockRemoveFromCart.mockResolvedValue({ orderId: "order-1", totalAmount: 0, items: [] });

        renderCart();
        await screen.findAllByText("Widget");

        fireEvent.click(screen.getAllByLabelText("Remove Widget from cart")[0]);

        const confirmDialog = await screen.findByText("Remove Item");
        expect(confirmDialog).toBeInTheDocument();
        expect(mockRemoveFromCart).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole("button", { name: "Remove" }));

        await waitFor(() => {
            expect(mockRemoveFromCart).toHaveBeenCalledWith("p1");
        });
    });

    it("decreasing the last unit of an item asks for removal confirmation instead of calling update directly", async () => {
        mockGetCart.mockResolvedValue({
            orderId: "order-1",
            totalAmount: 100,
            items: [{ productId: "p1", productName: "Widget", quantity: 1, unitPrice: 100, subTotal: 100 }]
        });

        renderCart();
        await screen.findAllByText("Widget");

        fireEvent.click(screen.getAllByLabelText("Decrease quantity of Widget")[0]);

        expect(await screen.findByText("Remove Item")).toBeInTheDocument();
        expect(mockUpdateCartItemQuantity).not.toHaveBeenCalled();
    });

    it("asks for confirmation before checkout, and navigates home only after confirming", async () => {
        mockGetCart.mockResolvedValue(sampleCart);
        mockCheckout.mockResolvedValue({ totalAmount: 200 });

        renderCart();
        await screen.findAllByText("Widget");

        fireEvent.click(screen.getByRole("button", { name: "Complete Purchase" }));

        expect(await screen.findByRole("dialog", { name: "Confirm Purchase" })).toBeInTheDocument();
        expect(mockCheckout).not.toHaveBeenCalled();

        fireEvent.click(screen.getAllByRole("button", { name: "Confirm Purchase" })[0]);

        await waitFor(() => {
            expect(mockCheckout).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("shows an error toast and stays on the page when checkout fails", async () => {
        mockGetCart.mockResolvedValue(sampleCart);
        mockCheckout.mockRejectedValue({ response: { data: { message: "Insufficient stock." } } });

        renderCart();
        await screen.findAllByText("Widget");

        fireEvent.click(screen.getByRole("button", { name: "Complete Purchase" }));
        fireEvent.click(await screen.findByRole("button", { name: "Confirm Purchase" }));

        await waitFor(() => {
            expect(mockCheckout).toHaveBeenCalledTimes(1);
        });
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
