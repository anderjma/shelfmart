import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SEO from "../../../../shared/components/SEO";
import Table from "../../../../shared/components/Table";
import type { TableColumn } from "../../../../shared/components/Table";
import Pagination from "../../../../shared/components/Pagination";
import { getAuditLogs } from "../api/auditLogService";
import type { AuditLogEntry } from "../api/auditLogService";
import { getErrorMessage } from "../../../../lib/http-error";
import AdminNav from "../../components/AdminNav";

export default function AuditLogTable() {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getAuditLogs(page);
                if (result.totalPages > 0 && page > result.totalPages) {
                    setPage(result.totalPages);
                    return;
                }
                setLogs(result.items);
                setTotalPages(result.totalPages);
            } catch (err) {
                const message = getErrorMessage(err, "Could not load the audit log.");
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        loadLogs();
    }, [page]);

    const columns: TableColumn<AuditLogEntry>[] = [
        { key: "user", header: "Performed By" },
        { key: "action", header: "Action" },
        {
            key: "timestamp",
            header: "Timestamp",
            className: "font-mono text-xs",
            render: (log) => new Date(log.timestamp).toLocaleString()
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO title="Audit Log" description="Review the history of administrative actions." />

            <h1 className="text-2xl font-bold text-gray-900 mb-4">Audit Log</h1>
            <AdminNav />

            {error && !loading && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded mb-4">{error}</div>
            )}

            <Table
                columns={columns}
                data={logs}
                keyExtractor={(log) => log.auditLogId}
                isLoading={loading}
                emptyMessage="No audit log entries found."
            />

            {!loading && (
                <div className="mt-4">
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
            )}
        </div>
    );
}
