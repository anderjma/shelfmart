import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SEO from "../../../../shared/components/SEO";
import Table from "../../../../shared/components/Table";
import type { TableColumn } from "../../../../shared/components/Table";
import { getAllOrders } from "../api/adminOrderService";
import type { AdminOrder, OrderStatus } from "../api/adminOrderService";
import { getErrorMessage } from "../../../../lib/http-error";
import { formatCurrency } from "../../../../shared/utils/formatCurrency";
import AdminNav from "../../components/AdminNav";

const statusBadgeClasses: Record<OrderStatus, string> = {
    Cart: "bg-cream-200 dark:bg-slate-800 text-ink-700 dark:text-slate-300",
    Pending: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    Confirmed: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
    Shipped: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800",
    Delivered: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    Cancelled: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
};

export default function OrdersAdmin() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllOrders();
                setOrders(data);
            } catch (err) {
                const message = getErrorMessage(err, "Could not load orders.");
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        void loadOrders();
    }, []);

    const filteredOrders = orders.filter((o) => {
        const term = searchTerm.toLowerCase();
        return o.orderId.toLowerCase().includes(term) || o.customerUsername.toLowerCase().includes(term) || o.status.toLowerCase().includes(term);
    });

    const columns: TableColumn<AdminOrder>[] = [
        { key: "orderId", header: "Order", render: (o) => o.orderId.slice(0, 8) },
        { key: "customerUsername", header: "Customer" },
        { key: "totalAmount", header: "Total", render: (o) => formatCurrency(o.totalAmount) },
        {
            key: "status",
            header: "Status",
            render: (o) => (
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClasses[o.status]}`}>
                    {o.status}
                </span>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO title="Manage Orders" description="Review orders and update their fulfillment status." />

            <h1 className="text-2xl font-bold text-ink-900 mb-4">Orders</h1>
            <AdminNav />

            <div className="mb-6 max-w-md relative">
                <input
                    type="text"
                    placeholder="Search orders..."
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
                data={filteredOrders}
                keyExtractor={(o) => o.orderId}
                isLoading={loading}
                emptyMessage="No orders found."
            />
        </div>
    );
}
