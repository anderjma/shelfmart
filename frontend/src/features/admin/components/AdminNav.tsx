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
        <nav className="mb-6 border-b border-sand-300 overflow-x-auto" aria-label="Admin sections">
            <div className="flex gap-1 min-w-max">
                {ADMIN_LINKS.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            `px-3 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1 rounded-t-lg ${
                                isActive
                                    ? "border-accent-500 text-accent-500"
                                    : "border-transparent text-ink-700 hover:text-ink-900 hover:border-sand-400"
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
