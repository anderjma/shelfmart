import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import UsersAdmin from "./UsersAdmin";

function renderWithRouter(ui: ReactElement) {
    return render(ui, { wrapper: MemoryRouter });
}

const { mockGetUsers } = vi.hoisted(() => ({
    mockGetUsers: vi.fn()
}));

vi.mock("../api/adminUserService", () => ({
    getUsers: mockGetUsers
}));

const sampleUser = {
    userResourceId: "u1",
    name: "Jane Doe",
    username: "janedoe",
    email: "jane@example.com",
    role: "Customer" as const
};

describe("UsersAdmin", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetUsers.mockResolvedValue([sampleUser]);
    });

    it("renders the user list from the API response", async () => {
        renderWithRouter(<UsersAdmin />);
        expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    });
});
