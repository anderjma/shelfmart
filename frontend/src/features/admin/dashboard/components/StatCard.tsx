import type { ReactNode } from "react";

export interface StatCardProps {
    label: string;
    value: string;
    icon: ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <div className="bg-white border border-sand-300 rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary-50 text-accent-500 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-sm text-ink-700">{label}</p>
                <p className="text-xl font-bold text-ink-900">{value}</p>
            </div>
        </div>
    );
}
