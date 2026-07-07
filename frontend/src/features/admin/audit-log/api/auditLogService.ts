// This file coordinates the RESTful integration for the paginated audit log viewer.
import axiosClient from "../../../../lib/api-client";

export interface AuditLogEntry {
    auditLogId: string;
    user: string;
    action: string;
    timestamp: string;
}

export interface PaginatedAuditLogs {
    items: AuditLogEntry[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export async function getAuditLogs(page: number, pageSize = 20): Promise<PaginatedAuditLogs> {
    const response = await axiosClient.get("/Audit/logs", { params: { page, pageSize } });
    return response.data;
}
