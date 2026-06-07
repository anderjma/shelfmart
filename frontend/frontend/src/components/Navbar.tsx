import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/authService";
import { User, LogOut, LogIn, UserPlus, ShoppingCart, Store, Menu, X } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const isAdmin = user?.role === "Admin";
    const isCustomer = user?.role === "Customer";
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-white shadow-sm border-b" aria-label="Navegación principal">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Lado Izquierdo: Logo y Rutas Principales */}
                    <div className="flex items-center space-x-8">
                        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                            <Store className="w-6 h-6" aria-hidden="true" />
                            <Link to="/" aria-label="Ir a la página de inicio del Portal Comercial" className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">Portal Comercial</Link>
                        </h1>
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">Inicio</Link>
                            <Link to="/catalogo" className="text-gray-600 hover:text-gray-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">Catálogo</Link>
                            <Link to="/nosotros" className="text-gray-600 hover:text-gray-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">Nosotros</Link>
                            <Link to="/contacto" className="text-gray-600 hover:text-gray-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">Contacto</Link>

                            {isAdmin && (
                                <>
                                    <span className="text-gray-300" aria-hidden="true">|</span>
                                    <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">Inventario</Link>
                                    <Link to="/admin/users" className="text-gray-600 hover:text-gray-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">Usuarios</Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Lado Derecho: Carrito y Usuario */}
                    <div className="hidden md:flex items-center space-x-6">
                        {isCustomer && (
                            <Link to="/cart" className="text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1" aria-label="Ver mi carrito de compras">
                                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/perfil" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1" aria-label={`Ver perfil de ${user.name}`}>
                                    <User className="w-4 h-4" aria-hidden="true" /> Hola, {user.name}
                                </Link>
                                <span className="text-gray-300" aria-hidden="true">|</span>
                                <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-800 inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1" aria-label="Cerrar sesión actual">
                                    <LogOut className="w-4 h-4" aria-hidden="true" /> Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
                                    <LogIn className="w-4 h-4" aria-hidden="true" /> Iniciar Sesión
                                </Link>
                                <Link to="/register" className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                                    <UserPlus className="w-4 h-4" aria-hidden="true" /> Registrarse
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Botón de Menú Móvil */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-2" aria-expanded={isMenuOpen} aria-controls="mobile-menu" aria-label={isMenuOpen ? "Cerrar menú principal" : "Abrir menú principal"}>
                            {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Desplegable Móvil */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white shadow-lg absolute w-full z-50" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
                        <Link to="/" onClick={toggleMenu} className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:bg-gray-100">Inicio</Link>
                        <Link to="/catalogo" onClick={toggleMenu} className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:bg-gray-100">Catálogo</Link>
                        <Link to="/nosotros" onClick={toggleMenu} className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:bg-gray-100">Nosotros</Link>
                        <Link to="/contacto" onClick={toggleMenu} className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:bg-gray-100">Contacto</Link>
                        
                        {isAdmin && (
                            <>
                                <div className="border-t border-gray-200 my-2"></div>
                                <Link to="/admin/dashboard" onClick={toggleMenu} className="text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:bg-blue-100">Inventario Admin</Link>
                                <Link to="/admin/users" onClick={toggleMenu} className="text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:bg-blue-100">Usuarios Admin</Link>
                            </>
                        )}
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200 bg-gray-50">
                        {user ? (
                            <div className="px-5 space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg" aria-hidden="true">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                                        <div className="text-sm font-medium text-gray-500">{user.role}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <Link to="/perfil" onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 px-2 py-2 rounded-md inline-flex items-center gap-3 focus:outline-none focus:bg-gray-200">
                                        <User className="w-5 h-5" aria-hidden="true" /> Mi Perfil
                                    </Link>
                                    {isCustomer && (
                                        <Link to="/cart" onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 px-2 py-2 rounded-md inline-flex items-center gap-3 focus:outline-none focus:bg-gray-200">
                                            <ShoppingCart className="w-5 h-5" aria-hidden="true" /> Mi Carrito
                                        </Link>
                                    )}
                                    <button onClick={() => { handleLogout(); toggleMenu(); }} className="text-red-600 hover:text-red-800 px-2 py-2 rounded-md text-left inline-flex items-center gap-3 focus:outline-none focus:bg-red-50 w-full">
                                        <LogOut className="w-5 h-5" aria-hidden="true" /> Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="px-5 flex flex-col space-y-3">
                                <Link to="/login" onClick={toggleMenu} className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md font-medium inline-flex justify-center items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <LogIn className="w-5 h-5" aria-hidden="true" /> Iniciar Sesión
                                </Link>
                                <Link to="/register" onClick={toggleMenu} className="bg-blue-600 text-white px-3 py-2 rounded-md font-medium hover:bg-blue-700 inline-flex justify-center items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                                    <UserPlus className="w-5 h-5" aria-hidden="true" /> Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
