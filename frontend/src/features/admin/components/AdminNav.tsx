// This file provides the lateral navigation between admin sections, otherwise only reachable by URL.
import { NavLink } from "react-router-dom";

const ADMIN_LINKS = [
    { to: "/admin", label: "Dashboard", end: true },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/audit-log", label: "Audit Log" }
];

export default function AdminNav() {
    return (
        <nav className="mb-6 border-b border-gray-200 overflow-x-auto" aria-label="Admin sections">
            <div className="flex gap-1 min-w-max">
                {ADMIN_LINKS.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            `px-3 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-t ${
                                isActive
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
