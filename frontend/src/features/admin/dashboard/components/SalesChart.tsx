import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { SalesChartPoint } from "../api/dashboardService";
import { formatCurrency } from "../../../../shared/utils/formatCurrency";

export interface SalesChartProps {
    data: SalesChartPoint[];
}

export default function SalesChart({ data }: SalesChartProps) {
    return (
        <div className="bg-white border border-sand-300 rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-medium text-ink-700 mb-4">Order Trends (Last 5 Days)</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd0ae" />
                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#45423b" }} />
                        <YAxis tick={{ fontSize: 12, fill: "#45423b" }} />
                        <Tooltip
                            contentStyle={{ borderRadius: 12, borderColor: "#ddd0ae", fontSize: 13 }}
                            formatter={(value) => [formatCurrency(Number(value)), "Total"]}
                        />
                        <Line type="monotone" dataKey="total" stroke="#014681" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
