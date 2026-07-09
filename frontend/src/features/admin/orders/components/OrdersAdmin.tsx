import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SEO from "../../../../shared/components/SEO";
import Table from "../../../../shared/components/Table";
import type { TableColumn } from "../../../../shared/components/Table";
import { getAllOrders, updateOrderStatus } from "../api/adminOrderService";
import type { AdminOrder, OrderStatus } from "../api/adminOrderService";
import { getErrorMessage } from "../../../../lib/http-error";
import { formatCurrency } from "../../../../shared/utils/formatCurrency";
import AdminNav from "../../components/AdminNav";

const ASSIGNABLE_STATUSES: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const statusBadgeClasses: Record<OrderStatus, string> = {
    Cart: "bg-gray-100 text-gray-700",
    Pending: "bg-amber-100 text-amber-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Shipped: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-emerald-100 text-emerald-800",
    Cancelled: "bg-red-100 text-red-700"
};

export default function OrdersAdmin() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

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

    const handleStatusChange = async (orderId: string, status: OrderStatus) => {
        setUpdatingOrderId(orderId);
        try {
            const updated = await updateOrderStatus(orderId, status);
            setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
            toast.success("Order status updated.");
        } catch (err) {
            toast.error(getErrorMessage(err, "Could not update the order status."));
        } finally {
            setUpdatingOrderId(null);
        }
    };

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
        },
        {
            key: "actions",
            header: "Update Status",
            render: (o) => (
                <select
                    value={o.status}
                    disabled={updatingOrderId === o.orderId}
                    onChange={(e) => handleStatusChange(o.orderId, e.target.value as OrderStatus)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                    {ASSIGNABLE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO title="Manage Orders" description="Review orders and update their fulfillment status." />

            <h1 className="text-2xl font-bold text-gray-900 mb-4">Orders</h1>
            <AdminNav />

            {error && !loading && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded mb-4">{error}</div>
            )}

            <Table
                columns={columns}
                data={orders}
                keyExtractor={(o) => o.orderId}
                isLoading={loading}
                emptyMessage="No orders found."
            />
        </div>
    );
}
