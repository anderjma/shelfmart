// This file provides the lateral navigation between admin sections, otherwise only reachable by URL.
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../../lib/i18n-context";

export default function AdminNav() {
    const { t } = useLanguage();

    const adminLinks = [
        { to: "/admin", label: t("adminNav.dashboard", "Dashboard"), end: true },
        { to: "/admin/products", label: t("adminNav.products", "Products") },
        { to: "/admin/orders", label: t("adminNav.orders", "Orders") },
        { to: "/admin/users", label: t("adminNav.users", "Users") },
        { to: "/admin/audit-log", label: t("adminNav.auditLog", "Audit Log") }
    ];

    return (
        <nav className="mb-6 border-b border-sand-300 dark:border-slate-700 overflow-x-auto" aria-label="Admin sections">
            <div className="flex gap-1 min-w-max">
                {adminLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            `px-3 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1 rounded-t-lg ${
                                isActive
                                    ? "border-accent-500 text-accent-500 dark:text-accent-400"
                                    : "border-transparent text-ink-700 dark:text-slate-300 hover:text-ink-900 dark:hover:text-white hover:border-sand-400 dark:hover:border-slate-600"
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
