import React, { useState, useEffect } from "react";
// This file contains the screen where customers can view their history and personal data.
import { useAuth } from "../../../lib/auth-context";
import { getMyOrders } from "../../cart/api/orderService";
import type { Cart, CartItem } from "../../cart/types";
import SEO from "../../../shared/components/SEO";

export default function Profile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Cart[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        if (user) {
            fetchOrders();
        }
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <SEO title="My Profile" description="Manage your user account and view your purchase history." />
            {/* Personal information card */}
            <div className="bg-white p-6 rounded-lg shadow-sm rounded-xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">My Profile</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600">
                    <div>
                        <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Full Name</p>
                        <p className="text-lg font-medium text-gray-900 mt-1">{user?.name || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Username</p>
                        <p className="text-lg font-medium text-gray-900 mt-1">@{user?.username || "N/A"}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Account Type</p>
                        <p className="text-xs font-semibold mt-1.5 inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                            {user?.role === "Admin" ? "Company Administrator" : "Regular Customer"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Transaction history */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Purchase History</h3>

                {loading ? (
                    <div className="text-center p-8 text-gray-500 font-medium">Loading your purchases...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-200 text-gray-500">
                        <p className="text-lg">You haven't made any purchases in the store yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all hover:shadow-md">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID: #{order.orderId.substring(0, 8).toUpperCase()}</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {order.items.map((item: CartItem, i: number) => (
                                            <li key={i} className="font-medium">
                                                {item.quantity}x {item.productName} <span className="text-gray-400 font-normal">(₡{item.unitPrice} each)</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 flex flex-col justify-end">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Amount</p>
                                    <p className="text-2xl font-bold text-green-600 mt-0.5">₡{order.totalAmount.toLocaleString('es-CR')}</p>
                                    <span className="text-xs bg-green-100 text-green-800 border border-green-200 px-2.5 py-0.5 rounded-full font-medium inline-block mt-2 self-start md:self-end">
                                        Payment Verified
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
