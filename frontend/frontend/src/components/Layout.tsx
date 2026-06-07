import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/authService";
import { User, LogOut, LogIn, UserPlus, ShoppingCart, Store } from "lucide-react";

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
                        {/* Lado Izquierdo: Logo y Rutas Principales */}
                        <div className="flex items-center space-x-8">
                            <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                                <Store className="w-6 h-6" />
                                <Link to="/">Portal Comercial</Link>
                            </h1>
                            <div className="space-x-4">
                                <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Inicio</Link>
                                <Link to="/catalogo" className="text-gray-600 hover:text-gray-900 font-medium">Catálogo</Link>
                                <Link to="/nosotros" className="text-gray-600 hover:text-gray-900 font-medium">Nosotros</Link>
                                <Link to="/contacto" className="text-gray-600 hover:text-gray-900 font-medium">Contacto</Link>

                                {isAdmin && (
                                    <>
                                        <span className="text-gray-300">|</span>
                                        <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Inventario</Link>
                                        <Link to="/admin/users" className="text-gray-600 hover:text-gray-900 font-medium">Usuarios</Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Lado Derecho: Carrito y Usuario */}
                        <div className="flex items-center space-x-6">
                            {isCustomer && (
                                <Link to="/cart" className="text-gray-600 hover:text-blue-600 transition-colors" title="Ver Mi Carrito">
                                    <ShoppingCart className="w-5 h-5" />
                                </Link>
                            )}

                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <Link to="/perfil" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5">
                                        <User className="w-4 h-4" /> Hola, {user.name}
                                    </Link>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-800 inline-flex items-center gap-1">
                                        <LogOut className="w-4 h-4" /> Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                                        <LogIn className="w-4 h-4" /> Iniciar Sesión
                                    </Link>
                                    <Link to="/register" className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 inline-flex items-center gap-1">
                                        <UserPlus className="w-4 h-4" /> Registrarse
                                    </Link>
                                </div>
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
