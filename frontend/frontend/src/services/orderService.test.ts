import { describe, test, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getCart, addToCart, checkout } from "./orderService";

vi.mock("axios");

describe("orderService tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test("getCart should perform a GET request with correct auth header", async () => {
        localStorage.setItem("token", "dummy-token");
        const dummyCart = { orderId: "123", totalAmount: 100, items: [] };
        
        // Esta instrucción simula la respuesta de la petición GET de axios.
        vi.mocked(axios.get).mockResolvedValue({ data: dummyCart });

        const result = await getCart();

        expect(axios.get).toHaveBeenCalledWith(
            "http://localhost:5000/api/Orders/cart",
            { headers: { Authorization: "Bearer dummy-token" } }
        );
        expect(result).toEqual(dummyCart);
    });

    test("addToCart should perform a POST request with payload and correct auth header", async () => {
        localStorage.setItem("token", "dummy-token");
        const payload = { productId: "p-123", quantity: 3 };
        const dummyCart = { orderId: "123", totalAmount: 300, items: [] };

        vi.mocked(axios.post).mockResolvedValue({ data: dummyCart });

        const result = await addToCart(payload);

        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:5000/api/Orders/cart/items",
            payload,
            { headers: { Authorization: "Bearer dummy-token" } }
        );
        expect(result).toEqual(dummyCart);
    });

    test("checkout should perform a POST request with empty body and auth header", async () => {
        localStorage.setItem("token", "dummy-token");
        const dummyOrder = { orderId: "123", status: "Completed" };

        vi.mocked(axios.post).mockResolvedValue({ data: dummyOrder });

        const result = await checkout();

        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:5000/api/Orders/checkout",
            {},
            { headers: { Authorization: "Bearer dummy-token" } }
        );
        expect(result).toEqual(dummyOrder);
    });
});
