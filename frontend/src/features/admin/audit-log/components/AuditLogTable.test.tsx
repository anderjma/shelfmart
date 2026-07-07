import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AuditLogTable from "./AuditLogTable";

const { mockGetAuditLogs } = vi.hoisted(() => ({ mockGetAuditLogs: vi.fn() }));

vi.mock("../api/auditLogService", () => ({
    getAuditLogs: mockGetAuditLogs
}));

describe("AuditLogTable", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders audit log entries from the API response", async () => {
        mockGetAuditLogs.mockResolvedValue({
            items: [
                { auditLogId: "l1", user: "admin", action: "Deleted product X", timestamp: new Date().toISOString() }
            ],
            totalCount: 1,
            page: 1,
            pageSize: 20,
            totalPages: 1
        });

        render(<AuditLogTable />);

        expect(await screen.findByText("Deleted product X")).toBeInTheDocument();
        expect(screen.getByText("admin")).toBeInTheDocument();
    });

    it("shows an error message when the request fails", async () => {
        mockGetAuditLogs.mockRejectedValue(new Error("network error"));

        render(<AuditLogTable />);

        expect(await screen.findByText("Could not load the audit log.")).toBeInTheDocument();
    });

    it("shows the empty state when there are no entries", async () => {
        mockGetAuditLogs.mockResolvedValue({ items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 1 });

        render(<AuditLogTable />);

        expect(await screen.findByText("No audit log entries found.")).toBeInTheDocument();
    });
});
