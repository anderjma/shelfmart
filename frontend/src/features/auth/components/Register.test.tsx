import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";

const { mockRegisterCustomer, mockNavigate } = vi.hoisted(() => ({
    mockRegisterCustomer: vi.fn(),
    mockNavigate: vi.fn()
}));

vi.mock("../api/authService", () => ({
    registerCustomer: mockRegisterCustomer
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

function renderRegister() {
    return render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );
}

function fillForm() {
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "janedoe" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Password123!" } });
}

describe("Register", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("submits the form data and navigates to login on success", async () => {
        mockRegisterCustomer.mockResolvedValue({ userResourceId: "u1" });

        renderRegister();
        fillForm();
        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        await waitFor(() => {
            expect(mockRegisterCustomer).toHaveBeenCalledWith({
                name: "Jane Doe",
                email: "jane@example.com",
                username: "janedoe",
                password: "Password123!"
            });
        });
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    it("shows the server error message when registration fails", async () => {
        mockRegisterCustomer.mockRejectedValue({ response: { data: { message: "Username already exists." } } });

        renderRegister();
        fillForm();
        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Username already exists.");
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("disables the submit button while the request is in flight", async () => {
        let resolveRegister: (value: unknown) => void = () => {};
        mockRegisterCustomer.mockReturnValue(new Promise((resolve) => { resolveRegister = resolve; }));

        renderRegister();
        fillForm();
        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        expect(await screen.findByRole("button", { name: "Registering..." })).toBeDisabled();

        resolveRegister({ userResourceId: "u1" });
        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
    });
});
