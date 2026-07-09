import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

const { mockLogin, mockNavigate } = vi.hoisted(() => ({
    mockLogin: vi.fn(),
    mockNavigate: vi.fn()
}));

vi.mock("../../../lib/auth-context", () => ({
    useAuth: () => ({ login: mockLogin })
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

function renderLogin() {
    return render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );
}

describe("Login", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("submits the entered credentials and navigates home on success", async () => {
        mockLogin.mockResolvedValue({ token: "abc" });

        renderLogin();

        fireEvent.change(screen.getByLabelText("Username"), { target: { value: "sharon" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Password123!" } });
        fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith("sharon", "Password123!");
        });
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("shows the server error message when login fails", async () => {
        mockLogin.mockRejectedValue({ response: { data: { message: "Invalid credentials." } } });

        renderLogin();

        fireEvent.change(screen.getByLabelText("Username"), { target: { value: "sharon" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
        fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials.");
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("falls back to a generic message when the error has no server message", async () => {
        mockLogin.mockRejectedValue(new Error("network down"));

        renderLogin();

        fireEvent.change(screen.getByLabelText("Username"), { target: { value: "sharon" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
        fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Login failed. Please check your credentials.");
    });
});
