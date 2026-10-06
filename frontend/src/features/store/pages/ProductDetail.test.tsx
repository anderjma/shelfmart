import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductDetail from "./ProductDetail";

const { mockGetProductById, mockGetProducts, mockAddToCart, mockUseAuth } = vi.hoisted(() => ({
    mockGetProductById: vi.fn(),
    mockGetProducts: vi.fn(),
    mockAddToCart: vi.fn(),
    mockUseAuth: vi.fn()
}));

vi.mock("../api/productService", () => ({
    getProductById: mockGetProductById,
    getProducts: mockGetProducts
}));

vi.mock("../../cart/api/orderService", () => ({
    addToCart: mockAddToCart
}));

vi.mock("../../../lib/auth-context", () => ({
    useAuth: mockUseAuth
}));

const mockProduct = {
    productResourceId: "prod-123",
    name: "Ergonomic Standing Desk",
    description: "Solid bamboo electric height adjustable desk with memory presets.",
    price: 349.99,
    discountPercentage: 10,
    stock: 8,
    category: "Furniture",
    imageUrl: "https://example.com/desk.jpg",
    createdAt: new Date().toISOString()
};

function renderComponent(productId = "prod-123") {
    return render(
        <MemoryRouter initialEntries={[`/products/${productId}`]}>
            <Routes>
                <Route path="/products/:id" element={<ProductDetail />} />
            </Routes>
        </MemoryRouter>
    );
}

describe("ProductDetail component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            isCustomer: true,
            isAdmin: false,
            user: { name: "Customer User" }
        });
        mockGetProductById.mockResolvedValue(mockProduct);
        mockGetProducts.mockResolvedValue([]);
    });

    it("renders product details, price, description and stock correctly", async () => {
        renderComponent();

        expect(await screen.findByRole("heading", { name: "Ergonomic Standing Desk" })).toBeInTheDocument();
        expect(screen.getByText(/Solid bamboo electric height adjustable desk/)).toBeInTheDocument();
        expect(screen.getByText("Furniture", { selector: "nav span" })).toBeInTheDocument();
        expect(screen.getByText(/In Stock/)).toBeInTheDocument();
    });

    it("allows changing quantity within stock bounds", async () => {
        renderComponent();

        expect(await screen.findByRole("heading", { name: "Ergonomic Standing Desk" })).toBeInTheDocument();

        const increaseBtn = screen.getByLabelText("Increase quantity");
        const decreaseBtn = screen.getByLabelText("Decrease quantity");

        expect(screen.getByText("1", { selector: "span" })).toBeInTheDocument();

        fireEvent.click(increaseBtn);
        expect(screen.getByText("2", { selector: "span" })).toBeInTheDocument();

        fireEvent.click(decreaseBtn);
        expect(screen.getByText("1", { selector: "span" })).toBeInTheDocument();
    });

    it("adds item to cart with selected quantity", async () => {
        mockAddToCart.mockResolvedValue({ id: "order-1" });
        renderComponent();

        expect(await screen.findByRole("heading", { name: "Ergonomic Standing Desk" })).toBeInTheDocument();

        const increaseBtn = screen.getByLabelText("Increase quantity");
        fireEvent.click(increaseBtn); // quantity = 2

        const addToCartBtn = screen.getByRole("button", { name: /Add to Cart/i });
        fireEvent.click(addToCartBtn);

        await waitFor(() => {
            expect(mockAddToCart).toHaveBeenCalledWith({
                productId: "prod-123",
                quantity: 2
            });
        });
    });

    it("renders Product Not Found state when product fetch fails", async () => {
        mockGetProductById.mockRejectedValue(new Error("Not Found"));
        renderComponent("unknown-id");

        expect(await screen.findByRole("heading", { name: /Product Not Found/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Return to Catalog/i })).toBeInTheDocument();
    });
});
