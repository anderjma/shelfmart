// This file defines the main navigation bar that remains constant throughout the application.
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth-context";
// This component provides the dynamic navigation links depending on the user's role.
import { User, LogOut, LogIn, ShoppingCart, Store, Menu, X } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout, isCustomer } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14 items-center">

                    {/* Brand and catalog */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="flex items-center gap-2 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">
                            <Store className="w-5 h-5" aria-hidden="true" />
                            <span className="font-bold text-lg tracking-tight">ShelfMart</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/catalog" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Catalog</Link>
                            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">About</Link>
                            <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Contact</Link>
                        </div>
                    </div>

                    {/* User actions */}
                    <div className="hidden md:flex items-center space-x-5">
                        {isCustomer && (
                            <Link to="/cart" className="text-slate-500 hover:text-blue-600 transition-colors relative" aria-label="View cart">
                                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-3 border-l border-slate-200 pl-5">
                                <Link to="/perfil" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                    <User className="w-4 h-4" aria-hidden="true" /> {user.name}
                                </Link>
                                <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded" title="Log out" aria-label="Log out">
                                    <LogOut className="w-4 h-4" aria-hidden="true" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 border-l border-slate-200 pl-5">
                                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
                                    <LogIn className="w-4 h-4" aria-hidden="true" /> Sign In
                                </Link>
                                <Link to="/register" className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger menu */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-slate-500 hover:text-slate-900 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" aria-expanded={isMenuOpen} aria-controls="mobile-menu" aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}>
                            {isMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full z-40" id="mobile-menu">
                    <div className="px-4 py-3 space-y-2">
                        <Link to="/catalog" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-md">Catalog</Link>
                        <Link to="/about" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-md">About</Link>
                        <Link to="/contact" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-md">Contact</Link>

                        <div className="border-t border-slate-100 my-2"></div>

                        {user ? (
                            <>
                                <Link to="/perfil" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">My Profile</Link>
                                {isCustomer && (
                                    <Link to="/cart" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">My Cart</Link>
                                )}
                                <button onClick={() => { handleLogout(); toggleMenu(); }} className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">Sign In</Link>
                                <Link to="/register" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">Create Account</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
