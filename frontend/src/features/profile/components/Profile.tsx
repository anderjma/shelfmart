// This file contains the screen where customers can view their history and personal data.
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../lib/auth-context";
import { useLanguage } from "../../../lib/i18n-context";
import { getMyOrders, cancelOrder } from "../../cart/api/orderService";
import type { Cart, CartItem } from "../../cart/types";
import SEO from "../../../shared/components/SEO";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import { getErrorMessage } from "../../../lib/http-error";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

const statusBadgeClasses: Record<string, string> = {
    Pending: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    Confirmed: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    Shipped: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    Delivered: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    Cancelled: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
};

export default function Profile() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [orders, setOrders] = useState<Cart[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingCancelOrderId, setPendingCancelOrderId] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await getMyOrders();
                setOrders(data);
            } catch (error) {
                console.error("Error loading history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, refreshKey]);

    const handleConfirmCancel = async () => {
        if (!pendingCancelOrderId) return;

        try {
            await cancelOrder(pendingCancelOrderId);
            toast.success(t("profile.cancelSuccess", "Order cancelled."));
            setRefreshKey((key) => key + 1);
        } catch (err) {
            toast.error(getErrorMessage(err, t("profile.cancelError", "Could not cancel the order.")));
        } finally {
            setPendingCancelOrderId(null);
        }
    };

    const getStatusLabel = (status?: string) => {
        if (!status) return "";
        return t(`profile.status${status}`, status);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <SEO title={t("profile.title", "My Profile")} description={t("profile.subtitle", "Manage your user account and view your purchase history.")} />
            {/* Personal information card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-sand-300 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-ink-900 dark:text-white mb-4">{t("profile.title", "My Profile")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-ink-700 dark:text-slate-300">
                    <div>
                        <p className="font-semibold text-ink-700 dark:text-slate-400 uppercase tracking-wider text-xs">{t("profile.fullName", "Full Name")}</p>
                        <p className="text-lg font-medium text-ink-900 dark:text-white mt-1">{user?.name || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-ink-700 dark:text-slate-400 uppercase tracking-wider text-xs">{t("profile.username", "Username")}</p>
                        <p className="text-lg font-medium text-ink-900 dark:text-white mt-1">@{user?.username || "N/A"}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <p className="font-semibold text-ink-700 dark:text-slate-400 uppercase tracking-wider text-xs">{t("profile.accountType", "Account Type")}</p>
                        <p className="text-xs font-semibold mt-1.5 inline-block bg-primary-50 dark:bg-slate-800 text-accent-500 dark:text-accent-400 px-3 py-1 rounded-full border border-primary-100 dark:border-slate-700">
                            {user?.role === "Admin" ? t("profile.roleAdmin", "Company Administrator") : t("profile.roleCustomer", "Regular Customer")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Transaction history */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-ink-900 dark:text-white">{t("profile.history", "Purchase History")}</h2>

                {loading ? (
                    <div className="text-center p-8 text-ink-700 dark:text-slate-300 font-medium">{t("profile.loading", "Loading your purchases...")}</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl shadow-sm border border-sand-300 dark:border-slate-700 text-ink-700 dark:text-slate-300">
                        <p className="text-lg">{t("profile.noOrders", "You haven't made any purchases in the store yet.")}</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <div key={order.orderId} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-sand-300 dark:border-slate-700 flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all hover:shadow-md">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-ink-700 dark:text-slate-400 uppercase tracking-wider">{t("profile.orderId", "Order ID:")} #{order.orderId.substring(0, 8).toUpperCase()}</p>
                                    <ul className="list-disc list-inside text-sm text-ink-700 dark:text-slate-300 space-y-1">
                                        {order.items.map((item: CartItem) => (
                                            <li key={item.productId} className="font-medium">
                                                {item.quantity}x {item.productName} <span className="text-ink-700/70 dark:text-slate-400 font-normal">({formatCurrency(item.unitPrice)} each)</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="text-left md:text-right border-t md:border-t-0 border-sand-300 dark:border-slate-700 pt-4 md:pt-0 flex flex-col justify-end gap-2">
                                    <div>
                                        <p className="text-xs text-ink-700 dark:text-slate-400 uppercase font-bold tracking-wider">{t("profile.totalAmount", "Total Amount")}</p>
                                        <p className="text-2xl font-bold text-ink-900 dark:text-white mt-0.5">{formatCurrency(order.totalAmount)}</p>
                                        {order.status && (
                                            <span className={`text-xs border px-2.5 py-0.5 rounded-full font-medium inline-block mt-2 self-start md:self-end ${statusBadgeClasses[order.status] ?? "bg-cream-100 dark:bg-slate-800 text-ink-700 dark:text-slate-300 border-sand-300 dark:border-slate-700"}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        )}
                                    </div>
                                    {order.status === "Pending" && (
                                        <button
                                            onClick={() => setPendingCancelOrderId(order.orderId)}
                                            className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline self-start md:self-end focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded-lg min-h-[36px]"
                                        >
                                            {t("profile.cancelOrder", "Cancel order")}
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
                title={t("profile.cancelOrderTitle", "Cancel Order")}
                message={t("profile.cancelOrderConfirm", "Do you want to cancel this order? This action cannot be undone.")}
                confirmLabel={t("profile.cancelOrderTitle", "Cancel Order")}
                confirmVariant="danger"
                onConfirm={handleConfirmCancel}
                onCancel={() => setPendingCancelOrderId(null)}
            />
        </div>
    );
}
