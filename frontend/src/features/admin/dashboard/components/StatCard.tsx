import type { ReactNode } from "react";

export interface StatCardProps {
    label: string;
    value: string;
    icon: ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
