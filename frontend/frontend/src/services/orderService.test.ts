import { describe, test, expect, vi, beforeEach } from "vitest";
import axiosClient from "../api/axiosClient";
import { getCart, addToCart, checkout } from "./orderService";

vi.mock("../api/axiosClient", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}));

describe("orderService tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("getCart should perform a GET request to /Orders/cart", async () => {
        const dummyCart = { orderId: "123", totalAmount: 100, items: [] };
        vi.mocked(axiosClient.get).mockResolvedValue({ data: dummyCart });

        const result = await getCart();

        expect(axiosClient.get).toHaveBeenCalledWith("/Orders/cart");
        expect(result).toEqual(dummyCart);
    });

    test("addToCart should perform a POST request to /Orders/cart/items with payload", async () => {
        const payload = { productId: "p-123", quantity: 3 };
        const dummyCart = { orderId: "123", totalAmount: 300, items: [] };
        vi.mocked(axiosClient.post).mockResolvedValue({ data: dummyCart });

        const result = await addToCart(payload);

        expect(axiosClient.post).toHaveBeenCalledWith("/Orders/cart/items", payload);
        expect(result).toEqual(dummyCart);
    });

    test("checkout should perform a POST request to /Orders/checkout", async () => {
        const dummyOrder = { orderId: "123", status: "Completed" };
        vi.mocked(axiosClient.post).mockResolvedValue({ data: dummyOrder });

        const result = await checkout();

        expect(axiosClient.post).toHaveBeenCalledWith("/Orders/checkout", {});
        expect(result).toEqual(dummyOrder);
    });
});
