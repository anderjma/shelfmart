import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/authService";

export default function Layout() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const isAdmin = user?.role === "Admin";
    const isCustomer = user?.role === "Customer";

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
                            <h1 className="text-xl font-bold text-blue-600">
                                <Link to="/">Inventario Pyme</Link>
                            </h1>
                            <div className="space-x-4">
                                {/* Rutas Públicas / Clientes */}
                                <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Catálogo</Link>
                                {isCustomer && (
                                    <Link to="/cart" className="text-gray-600 hover:text-gray-900 font-medium">Mi Carrito</Link>
                                )}

                                {/* Rutas de Administrador */}
                                {isAdmin && (
                                    <>
                                        <span className="text-gray-300">|</span>
                                        <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Inventario</Link>
                                        <Link to="/admin/users" className="text-gray-600 hover:text-gray-900 font-medium">Usuarios</Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="text-sm font-medium text-gray-600">Hola, {user.name}</span>
                                    <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-800">Cerrar Sesión</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-800">Iniciar Sesión</Link>
                                    <Link to="/register" className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">Registrarse</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}
