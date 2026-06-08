import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/authService";
import { User, LogOut, LogIn, ShoppingCart, Store, Menu, X, ShieldCheck } from "lucide-react";

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
        <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50" aria-label="Navegación principal">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14 items-center">
                    
                    {/* Lado Izquierdo: Marca y Catálogo */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="flex items-center gap-2 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">
                            <Store className="w-5 h-5" aria-hidden="true" />
                            <span className="font-bold text-lg tracking-tight">Portal Comercial</span>
                        </Link>
                        
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/catalogo" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Catálogo</Link>
                            {isAdmin && (
                                <Link to="/admin/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                                    <ShieldCheck className="w-4 h-4" /> Panel Admin
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Lado Derecho: Acciones de Usuario */}
                    <div className="hidden md:flex items-center space-x-5">
                        {isCustomer && (
                            <Link to="/cart" className="text-slate-500 hover:text-blue-600 transition-colors relative" aria-label="Ver carrito">
                                <ShoppingCart className="w-5 h-5" />
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-3 border-l border-slate-200 pl-5">
                                <Link to="/perfil" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                    <User className="w-4 h-4" /> {user.name}
                                </Link>
                                <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Cerrar sesión">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 border-l border-slate-200 pl-5">
                                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                                    <LogIn className="w-4 h-4" /> Entrar
                                </Link>
                                <Link to="/register" className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
                                    Crear Cuenta
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Menú Móvil (Hamburguesa) */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-slate-500 hover:text-slate-900 p-2 focus:outline-none">
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Desplegable Móvil */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full z-40">
                    <div className="px-4 py-3 space-y-2">
                        <Link to="/catalogo" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-md">Catálogo</Link>
                        
                        {isAdmin && (
                            <Link to="/admin/dashboard" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">Panel Admin</Link>
                        )}
                        
                        <div className="border-t border-slate-100 my-2"></div>
                        
                        {user ? (
                            <>
                                <Link to="/perfil" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">Mi Perfil</Link>
                                {isCustomer && (
                                    <Link to="/cart" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">Mi Carrito</Link>
                                )}
                                <button onClick={() => { handleLogout(); toggleMenu(); }} className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">Entrar</Link>
                                <Link to="/register" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">Crear Cuenta</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
