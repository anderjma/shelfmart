// Este archivo provee la interfaz gráfica para que los administradores puedan crear y monitorear cuentas de usuario.
import React, { useEffect, useState } from "react";
import { getUsers, createUser } from "../services/userService";
import type { User, UserFormData } from "../types/user";

// Este componente despliega una tabla dinámica con los datos de contacto y permite registrar nuevos perfiles.
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

    useEffect(() => {
        let active = true;
        getUsers()
            .then((data) => {
                if (active) setUsers(data);
            })
            .catch((err) => {
                const error = err as { response?: { data?: { message?: string } } };
                if (active) setError(error.response?.data?.message || "Acceso denegado.");
            });
        return () => {
            active = false;
        };
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
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            alert(error.response?.data?.message || "Error al crear el usuario");
        }
    };

    return (
        <div>
            <div className="px-4 sm:px-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h2>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
                {!error && (
                    <button onClick={handleOpenModal} className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium text-sm text-center">
                        + Nuevo Usuario
                    </button>
                )}
            </div>

            {/* Tabla para escritorio */}
            <div className="hidden sm:block bg-white shadow overflow-hidden sm:rounded-md border border-gray-100">
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

            {/* Tarjetas para móviles */}
            <div className="block sm:hidden space-y-4 px-4 sm:px-0">
                {users.length === 0 && !error ? (
                    <div className="text-center p-8 bg-white rounded-lg border border-gray-200 text-gray-500">No se encontraron usuarios registrados.</div>
                ) : (
                    users.map((u) => (
                        <div key={u.userResourceId} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-2.5">
                            <div className="border-b border-gray-100 pb-2 flex justify-between items-center">
                                <span className="font-bold text-gray-900 text-sm">{u.name}</span>
                                <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-100">Cliente</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-400 block">Usuario</span>
                                    <span className="font-medium text-gray-800">@{u.username}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block">Correo</span>
                                    <span className="font-medium text-gray-800 truncate block" title={u.email}>{u.email}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
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
