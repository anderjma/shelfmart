import React, { useEffect, useState } from "react";
import { getUsers, createUser } from "../services/userService";
import type { User, UserFormData } from "../types/user";

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        username: "",
        email: "",
        password: ""
    });

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Acceso denegado.");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleOpenModal = () => {
        setFormData({ name: "", username: "", email: "", password: "" });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser(formData);
            handleCloseModal();
            loadUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || "Error al crear el usuario");
        }
    };

    return (
        <div>
            <div className="px-4 sm:px-0 flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h2>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
                {!error && (
                    <button onClick={handleOpenModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        + Nuevo Usuario
                    </button>
                )}
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Nuevo Usuario</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                                    <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contraseña temporal</label>
                                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={handleCloseModal} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">Cancelar</button>
                                <button type="submit" className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none">Crear Usuario</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
