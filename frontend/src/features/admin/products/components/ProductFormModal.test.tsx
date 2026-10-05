import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductFormModal from "./ProductFormModal";
import * as adminProductService from "../api/adminProductService";

vi.mock("../api/categoryService", () => ({
    getCategories: vi.fn().mockResolvedValue([{ categoryId: "c1", name: "Electronics" }]),
    createCategory: vi.fn()
}));

vi.mock("../api/adminProductService", () => ({
    uploadProductImage: vi.fn()
}));

describe("ProductFormModal", () => {
    const mockCategories = [{ categoryId: "c1", name: "Electronics" }];
    const mockSubmit = vi.fn();
    const mockClose = vi.fn();

    it("renders numeric inputs without keeping 0 stuck when typing digits", () => {
        render(
            <ProductFormModal
                isOpen={true}
                onClose={mockClose}
                onSubmit={mockSubmit}
                categories={mockCategories}
            />
        );

        const stockInput = screen.getByLabelText("Stock") as HTMLInputElement;
        const priceInput = screen.getByLabelText("Price") as HTMLInputElement;

        expect(stockInput.value).toBe("0");
        expect(priceInput.value).toBe("0");

        // Typing '25' into stock should replace '0', not become '025'
        fireEvent.change(stockInput, { target: { value: "025" } });
        expect(stockInput.value).toBe("25");

        // Typing '99.99' into price
        fireEvent.change(priceInput, { target: { value: "099.99" } });
        expect(priceInput.value).toBe("99.99");
    });

    it("uploads local image file to Supabase when submitting", async () => {
        const uploadMock = vi.mocked(adminProductService.uploadProductImage);
        uploadMock.mockResolvedValue("https://xyz.supabase.co/storage/v1/object/public/shelfmart-images/products/test.png");
        mockSubmit.mockResolvedValue(undefined);

        render(
            <ProductFormModal
                isOpen={true}
                onClose={mockClose}
                onSubmit={mockSubmit}
                categories={mockCategories}
            />
        );

        const nameInput = screen.getByLabelText("Name");
        fireEvent.change(nameInput, { target: { value: "Wireless Mouse" } });

        const file = new File(["dummy content"], "mouse.png", { type: "image/png" });
        const fileInput = screen.getByLabelText("Image", { selector: "input" }) as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [file] } });

        const submitBtn = screen.getByText("Create Product");
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(uploadMock).toHaveBeenCalledWith(file);
            expect(mockSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Wireless Mouse",
                    imageUrl: "https://xyz.supabase.co/storage/v1/object/public/shelfmart-images/products/test.png"
                })
            );
        });
    });
});

