import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import UsersAdmin from "./UsersAdmin";

function renderWithRouter(ui: ReactElement) {
    return render(ui, { wrapper: MemoryRouter });
}

const { mockGetUsers, mockUpdateUserRole } = vi.hoisted(() => ({
    mockGetUsers: vi.fn(),
    mockUpdateUserRole: vi.fn()
}));

vi.mock("../api/adminUserService", () => ({
    getUsers: mockGetUsers,
    updateUserRole: mockUpdateUserRole
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

    it("opens the edit role modal and only offers Admin and Customer options", async () => {
        renderWithRouter(<UsersAdmin />);
        await screen.findByText("Jane Doe");

        fireEvent.click(screen.getByLabelText("Edit role for Jane Doe"));

        const select = await screen.findByRole("combobox");
        const options = within(select).getAllByRole("option");

        expect(options).toHaveLength(2);
        expect(options.map((o) => o.textContent)).toEqual(["Admin", "Customer"]);
    });

    it("calls updateUserRole with the selected role when saving", async () => {
        mockUpdateUserRole.mockResolvedValue({ ...sampleUser, role: "Admin" });

        renderWithRouter(<UsersAdmin />);
        await screen.findByText("Jane Doe");

        fireEvent.click(screen.getByLabelText("Edit role for Jane Doe"));
        const select = await screen.findByRole("combobox");
        fireEvent.change(select, { target: { value: "Admin" } });
        fireEvent.click(screen.getByText("Save"));

        await screen.findByText("Jane Doe");
        expect(mockUpdateUserRole).toHaveBeenCalledWith("u1", "Admin");
    });
});
