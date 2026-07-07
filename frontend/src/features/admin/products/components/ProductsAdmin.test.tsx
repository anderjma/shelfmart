import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductsAdmin from "./ProductsAdmin";

const { mockGetProducts, mockGetCategories, mockCreateProduct, mockDeleteProduct } = vi.hoisted(() => ({
    mockGetProducts: vi.fn(),
    mockGetCategories: vi.fn(),
    mockCreateProduct: vi.fn(),
    mockDeleteProduct: vi.fn()
}));

vi.mock("../../../store/api/productService", () => ({
    getProducts: mockGetProducts
}));

vi.mock("../api/categoryService", () => ({
    getCategories: mockGetCategories
}));

vi.mock("../api/adminProductService", () => ({
    createProduct: mockCreateProduct,
    updateProduct: vi.fn(),
    deleteProduct: mockDeleteProduct
}));

const sampleProduct = {
    productResourceId: "p1",
    name: "Widget",
    stock: 10,
    price: 25,
    category: "General",
    discountPercentage: 0,
    createdAt: new Date().toISOString()
};

function mockPaginatedResponse(items = [sampleProduct]) {
    return {
        items,
        totalCount: items.length,
        page: 1,
        pageSize: 10,
        totalPages: 1
    };
}

describe("ProductsAdmin", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetCategories.mockResolvedValue([{ categoryId: "c1", name: "General" }]);
    });

    it("renders the product list from the API response", async () => {
        mockGetProducts.mockResolvedValue(mockPaginatedResponse());

        render(<ProductsAdmin />);

        expect(await screen.findByText("Widget")).toBeInTheDocument();
    });

    it("opens the form modal when the New Product button is clicked", async () => {
        mockGetProducts.mockResolvedValue(mockPaginatedResponse());

        render(<ProductsAdmin />);
        await screen.findByText("Widget");

        fireEvent.click(screen.getByText("New Product"));

        expect(await screen.findByText("New Product", { selector: "h2" })).toBeInTheDocument();
    });

    it("triggers the soft delete API call when Deactivate is confirmed", async () => {
        mockGetProducts.mockResolvedValue(mockPaginatedResponse());
        mockDeleteProduct.mockResolvedValue(undefined);

        render(<ProductsAdmin />);
        await screen.findByText("Widget");

        fireEvent.click(screen.getByLabelText("Deactivate Widget"));
        fireEvent.click(await screen.findByText("Deactivate", { selector: "button" }));

        await waitFor(() => {
            expect(mockDeleteProduct).toHaveBeenCalledWith("p1");
        });
    });
});
