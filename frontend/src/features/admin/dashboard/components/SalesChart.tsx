import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { SalesChartPoint } from "../api/dashboardService";
import { formatCurrency } from "../../../../shared/utils/formatCurrency";

export interface SalesChartProps {
    data: SalesChartPoint[];
}

export default function SalesChart({ data }: SalesChartProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Order Trends (Last 5 Days)</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <Tooltip
                            contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb", fontSize: 13 }}
                            formatter={(value) => [formatCurrency(Number(value)), "Total"]}
                        />
                        <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
