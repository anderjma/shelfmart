import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import SEO from "../../../../shared/components/SEO";
import Table from "../../../../shared/components/Table";
import type { TableColumn } from "../../../../shared/components/Table";
import { getUsers, updateUserRole } from "../api/adminUserService";
import type { AdminUser, UserRole } from "../api/adminUserService";
import EditUserModal from "./EditUserModal";
import { getErrorMessage } from "../../../../lib/http-error";
import AdminNav from "../../components/AdminNav";

export default function UsersAdmin() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (err) {
                const message = getErrorMessage(err, "Could not load users.");
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        void loadUsers();
    }, []);

    const handleSaveRole = async (userId: string, role: UserRole) => {
        const updated = await updateUserRole(userId, role);
        setUsers((prev) => prev.map((u) => (u.userResourceId === userId ? updated : u)));
        toast.success("User role updated.");
    };

    const columns: TableColumn<AdminUser>[] = [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        {
            key: "role",
            header: "Role",
            render: (u) => (
                <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.role === "Admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"
                    }`}
                >
                    {u.role}
                </span>
            )
        },
        {
            key: "actions",
            header: "Actions",
            render: (u) => (
                <button
                    onClick={() => setEditingUser(u)}
                    className="text-slate-500 hover:text-blue-600 transition-colors"
                    aria-label={`Edit role for ${u.name}`}
                >
                    <Pencil className="w-4 h-4" aria-hidden="true" />
                </button>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO title="Manage Users" description="Review accounts and manage their roles." />

            <h1 className="text-2xl font-bold text-gray-900 mb-4">Users</h1>
            <AdminNav />

            {error && !loading && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded mb-4">{error}</div>
            )}

            <Table
                columns={columns}
                data={users}
                keyExtractor={(u) => u.userResourceId}
                isLoading={loading}
                emptyMessage="No users found."
            />

            <EditUserModal
                key={editingUser?.userResourceId ?? "none"}
                user={editingUser}
                onClose={() => setEditingUser(null)}
                onSave={handleSaveRole}
            />
        </div>
    );
}
