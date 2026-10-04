import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import SEO from "../../../../shared/components/SEO";
import Table from "../../../../shared/components/Table";
import type { TableColumn } from "../../../../shared/components/Table";
import { getUsers } from "../api/adminUserService";
import type { AdminUser } from "../api/adminUserService";
import { getErrorMessage } from "../../../../lib/http-error";
import AdminNav from "../../components/AdminNav";

export default function UsersAdmin() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredUsers = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return users.filter((u) => 
            u.name.toLowerCase().includes(lowerSearch) || 
            u.email.toLowerCase().includes(lowerSearch)
        );
    }, [users, searchTerm]);

    const columns: TableColumn<AdminUser>[] = [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO title="Manage Users" description="Review accounts." />

            <h1 className="text-2xl font-bold text-ink-900 mb-4">Users</h1>
            <AdminNav />

            <div className="mb-6 max-w-md relative">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <Search className="w-5 h-5 text-ink-700/40 absolute left-3 top-3" />
            </div>

            {error && !loading && (
                <div className="text-red-700 text-sm text-center bg-red-50 p-3 rounded-xl mb-4">{error}</div>
            )}

            <Table
                columns={columns}
                data={filteredUsers}
                keyExtractor={(u) => u.userResourceId}
                isLoading={loading}
                emptyMessage="No users found."
            />
        </div>
    );
}
