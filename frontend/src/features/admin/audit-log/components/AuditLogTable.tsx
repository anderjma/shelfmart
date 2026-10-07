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
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredLogs = logs.filter((log) => {
        const term = searchTerm.toLowerCase();
        return log.user.toLowerCase().includes(term) || log.action.toLowerCase().includes(term);
    });

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

            <h1 className="text-2xl font-bold text-ink-900 mb-4">Audit Log</h1>
            <AdminNav />

            <div className="mb-6 max-w-md relative">
                <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-sand-300 dark:border-slate-700 text-ink-900 dark:text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
            </div>

            {error && !loading && (
                <div className="text-red-700 text-sm text-center bg-red-50 p-3 rounded-xl mb-4">{error}</div>
            )}

            <Table
                columns={columns}
                data={filteredLogs}
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
