// This file defines the main navigation bar that remains constant throughout the application.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth-context";
// This component provides the dynamic navigation links depending on the user's role.
import { User, LogOut, LogIn, ShoppingCart, Store, Menu, X } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout, isCustomer, isAdmin } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-cream-50 shadow-sm border-b border-sand-300 sticky top-0 z-50" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Brand and catalog */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="flex items-center gap-2 text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-700 rounded-lg p-1">
                            <Store className="w-5 h-5" aria-hidden="true" />
                            <span className="font-semibold text-xl tracking-tight">ShelfMart</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-5">
                            <Link to="/catalog" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors">Catalog</Link>
                            <Link to="/about" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors">About</Link>
                            <Link to="/contact" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors">Contact</Link>
                            {isAdmin && (
                                <Link to="/admin" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors">Admin</Link>
                            )}
                        </div>
                    </div>

                    {/* User actions */}
                    <div className="hidden md:flex items-center space-x-5">
                        {isCustomer && (
                            <Link to="/cart" className="text-ink-700 hover:text-navy-800 transition-colors relative" aria-label="View cart">
                                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-3 border-l border-sand-300 pl-5">
                                <Link to="/perfil" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors flex items-center gap-1.5">
                                    <User className="w-4 h-4" aria-hidden="true" /> {user.name}
                                </Link>
                                <button onClick={handleLogout} className="text-ink-700/60 hover:text-red-700 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg" title="Log out" aria-label="Log out">
                                    <LogOut className="w-4 h-4" aria-hidden="true" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 border-l border-sand-300 pl-5">
                                <Link to="/login" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-navy-700 rounded-lg px-2 py-1">
                                    <LogIn className="w-4 h-4" aria-hidden="true" /> Sign In
                                </Link>
                                <Link to="/register" className="text-xs font-medium bg-navy-800 text-white px-3 py-1.5 rounded-lg hover:bg-navy-900 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-700 focus:ring-offset-1">
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger menu */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-ink-700 hover:text-ink-900 p-2 focus:outline-none focus:ring-2 focus:ring-navy-700 rounded-lg" aria-expanded={isMenuOpen} aria-controls="mobile-menu" aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}>
                            {isMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-cream-50 border-t border-sand-300 shadow-lg absolute w-full z-40" id="mobile-menu">
                    <div className="px-4 py-3 space-y-2">
                        <Link to="/catalog" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-navy-800 rounded-lg">Catalog</Link>
                        <Link to="/about" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-navy-800 rounded-lg">About</Link>
                        <Link to="/contact" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-navy-800 rounded-lg">Contact</Link>
                        {isAdmin && (
                            <Link to="/admin" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-navy-800 rounded-lg">Admin</Link>
                        )}

                        <div className="border-t border-sand-300 my-2"></div>

                        {user ? (
                            <>
                                <Link to="/perfil" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 rounded-lg">My Profile</Link>
                                {isCustomer && (
                                    <Link to="/cart" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 rounded-lg">My Cart</Link>
                                )}
                                <button onClick={() => { handleLogout(); toggleMenu(); }} className="block w-full text-left px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg">
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 rounded-lg">Sign In</Link>
                                <Link to="/register" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-navy-800 hover:bg-cream-200 rounded-lg">Create Account</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
