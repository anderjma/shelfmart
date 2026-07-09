// This file contains the screen where customers can view their history and personal data.
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../lib/auth-context";
import { getMyOrders, cancelOrder } from "../../cart/api/orderService";
import type { Cart, CartItem } from "../../cart/types";
import SEO from "../../../shared/components/SEO";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import { getErrorMessage } from "../../../lib/http-error";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

const statusBadgeClasses: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-800 border-amber-200",
    Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    Shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200"
};

export default function Profile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Cart[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingCancelOrderId, setPendingCancelOrderId] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const data = await getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error loading history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleConfirmCancel = async () => {
        if (!pendingCancelOrderId) return;

        try {
            await cancelOrder(pendingCancelOrderId);
            toast.success("Order cancelled.");
            await fetchOrders();
        } catch (err) {
            toast.error(getErrorMessage(err, "Could not cancel the order."));
        } finally {
            setPendingCancelOrderId(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <SEO title="My Profile" description="Manage your user account and view your purchase history." />
            {/* Personal information card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">My Profile</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600">
                    <div>
                        <p className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Full Name</p>
                        <p className="text-lg font-medium text-gray-900 mt-1">{user?.name || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Username</p>
                        <p className="text-lg font-medium text-gray-900 mt-1">@{user?.username || "N/A"}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <p className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Account Type</p>
                        <p className="text-xs font-semibold mt-1.5 inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                            {user?.role === "Admin" ? "Company Administrator" : "Regular Customer"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Transaction history */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Purchase History</h2>

                {loading ? (
                    <div className="text-center p-8 text-gray-500 font-medium">Loading your purchases...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-200 text-gray-500">
                        <p className="text-lg">You haven't made any purchases in the store yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <div key={order.orderId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all hover:shadow-md">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID: #{order.orderId.substring(0, 8).toUpperCase()}</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {order.items.map((item: CartItem) => (
                                            <li key={item.productId} className="font-medium">
                                                {item.quantity}x {item.productName} <span className="text-gray-500 font-normal">({formatCurrency(item.unitPrice)} each)</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 flex flex-col justify-end gap-2">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Amount</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-0.5">{formatCurrency(order.totalAmount)}</p>
                                        {order.status && (
                                            <span className={`text-xs border px-2.5 py-0.5 rounded-full font-medium inline-block mt-2 self-start md:self-end ${statusBadgeClasses[order.status] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
                                                {order.status}
                                            </span>
                                        )}
                                    </div>
                                    {order.status === "Pending" && (
                                        <button
                                            onClick={() => setPendingCancelOrderId(order.orderId)}
                                            className="text-xs font-medium text-red-600 hover:text-red-800 hover:underline self-start md:self-end focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded"
                                        >
                                            Cancel order
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!pendingCancelOrderId}
                title="Cancel Order"
                message="Do you want to cancel this order? This action cannot be undone."
                confirmLabel="Cancel Order"
                confirmVariant="danger"
                onConfirm={handleConfirmCancel}
                onCancel={() => setPendingCancelOrderId(null)}
            />
        </div>
    );
}
