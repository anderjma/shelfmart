import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

function renderWithRouter(ui: ReactElement) {
    return render(ui, { wrapper: MemoryRouter });
}

const { mockGetDashboardStats } = vi.hoisted(() => ({ mockGetDashboardStats: vi.fn() }));

vi.mock("../api/dashboardService", () => ({
    getDashboardStats: mockGetDashboardStats
}));

const sampleStats = {
    revenue: 1000,
    orders: 5,
    lowStock: 2,
    totalCustomers: 8,
    salesChart: [{ date: "Mon", total: 100 }]
};

describe("Dashboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders metric cards after fetching data", async () => {
        mockGetDashboardStats.mockResolvedValue(sampleStats);

        renderWithRouter(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText("Total Orders")).toBeInTheDocument();
        });
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("shows a loading state before data arrives", () => {
        mockGetDashboardStats.mockReturnValue(new Promise(() => {}));

        const { container } = renderWithRouter(<Dashboard />);

        expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    });

    it("shows an error message when the request fails", async () => {
        mockGetDashboardStats.mockRejectedValue(new Error("network error"));

        renderWithRouter(<Dashboard />);

        expect(await screen.findByText("Could not load dashboard statistics.")).toBeInTheDocument();
    });
});
