import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DollarSign, ShoppingBag, AlertTriangle, Users } from "lucide-react";
import SEO from "../../../../shared/components/SEO";
import { getDashboardStats } from "../api/dashboardService";
import type { DashboardStats } from "../api/dashboardService";
import StatCard from "./StatCard";
import SalesChart from "./SalesChart";

const StatCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex items-center gap-4 animate-pulse">
        <div className="w-11 h-11 rounded-md bg-gray-200 shrink-0"></div>
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
        </div>
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch {
                setError("Could not load dashboard statistics.");
                toast.error("Could not load dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO title="Admin Dashboard" description="Business metrics overview for administrators." />

            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {error && !loading && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded mb-6">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {loading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    <>
                        <StatCard
                            label="Total Revenue"
                            value={`₡${(stats?.revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                            icon={<DollarSign className="w-5 h-5" aria-hidden="true" />}
                        />
                        <StatCard
                            label="Total Orders"
                            value={String(stats?.orders ?? 0)}
                            icon={<ShoppingBag className="w-5 h-5" aria-hidden="true" />}
                        />
                        <StatCard
                            label="Low Stock Products"
                            value={String(stats?.lowStock ?? 0)}
                            icon={<AlertTriangle className="w-5 h-5" aria-hidden="true" />}
                        />
                        <StatCard
                            label="Total Customers"
                            value={String(stats?.totalCustomers ?? 0)}
                            icon={<Users className="w-5 h-5" aria-hidden="true" />}
                        />
                    </>
                )}
            </div>

            {!loading && stats && <SalesChart data={stats.salesChart} />}
        </div>
    );
}
