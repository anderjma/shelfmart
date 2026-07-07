import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "./auth-context";
import type { User } from "./auth-context";

const { mockGetCurrentUser } = vi.hoisted(() => ({ mockGetCurrentUser: vi.fn() }));

vi.mock("../features/auth/api/authService", () => ({
    getCurrentUser: mockGetCurrentUser,
    login: vi.fn(),
    logout: vi.fn()
}));

function Probe() {
    const { isAdmin, isCustomer } = useAuth();
    return (
        <span data-testid="probe">
            {`isAdmin:${isAdmin}|isCustomer:${isCustomer}`}
        </span>
    );
}

function renderWithUser(user: User | null) {
    mockGetCurrentUser.mockReturnValue(user);
    render(
        <AuthProvider>
            <Probe />
        </AuthProvider>
    );
}

describe("auth-context", () => {
    it("isAdmin is true when the user's role is Admin", () => {
        renderWithUser({ name: "Admin User", username: "admin", role: "Admin" });
        expect(screen.getByTestId("probe")).toHaveTextContent("isAdmin:true|isCustomer:false");
    });

    it("isAdmin is false when the user's role is Customer", () => {
        renderWithUser({ name: "Customer User", username: "customer", role: "Customer" });
        expect(screen.getByTestId("probe")).toHaveTextContent("isAdmin:false|isCustomer:true");
    });

    it("isAdmin is false when there is no user", () => {
        renderWithUser(null);
        expect(screen.getByTestId("probe")).toHaveTextContent("isAdmin:false|isCustomer:false");
    });
});
