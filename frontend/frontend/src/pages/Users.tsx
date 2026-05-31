import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout, getCurrentUser } from "../services/authService";
import { getUsers } from "../services/userService";
import type { User } from "../types/user";

export default function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string>("");
    
    const user = getCurrentUser();
    const isAdmin = user?.role === "Admin";

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Acceso denegado.");
            }
        };
        loadUsers();
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-xl font-bold text-gray-800">Inventario Pyme</h1>
                            <div className="space-x-4">
                                <Link to="/" className="text-gray-600 hover:text-gray-900">Productos</Link>
                                {isAdmin && <Link to="/users" className="font-semibold text-blue-600">Usuarios</Link>}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-600">Hola, {user?.name}</span>
                            <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-800">Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h2>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo Electrónico</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.length === 0 && !error ? (
                                <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No se encontraron usuarios registrados.</td></tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.userResourceId}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
