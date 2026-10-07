import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth-context";
import { useTheme } from "../../lib/theme-context";
import { useLanguage } from "../../lib/i18n-context";
// This component provides the dynamic navigation links depending on the user's role.
import { User, LogOut, LogIn, ShoppingCart, Store, Menu, X, Sun, Moon, Globe } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout, isCustomer, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header role="banner" className="bg-cream-50 shadow-sm border-b border-sand-300 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
                <div className="flex justify-between h-16 items-center">

                    {/* Brand and catalog */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="flex items-center gap-2 text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-700 rounded-lg p-1">
                            <Store className="w-5 h-5" aria-hidden="true" />
                            <span className="font-semibold text-xl tracking-tight">ShelfMart</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-5">
                            <Link to="/catalog" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors">{t("nav.catalog", "Catalog")}</Link>
                            <Link to="/about" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors">{t("nav.about", "About")}</Link>
                            <Link to="/contact" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors">{t("nav.contact", "Contact")}</Link>
                            {isAdmin && (
                                <Link to="/admin" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors">{t("nav.admin", "Admin")}</Link>
                            )}
                        </div>
                    </div>

                    {/* User actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {(!user || isCustomer) && (
                            <Link
                                to={user ? "/cart" : "/login"}
                                className="text-ink-700 hover:text-navy-800 transition-colors relative p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-700"
                                aria-label={t("nav.viewCart", "View cart")}
                                title={user ? t("nav.viewCart", "View cart") : t("nav.signInToCart", "Sign in to view cart")}
                            >
                                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-3 border-l border-sand-300 pl-4">
                                <Link to="/perfil" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors flex items-center gap-1.5">
                                    <User className="w-4 h-4" aria-hidden="true" /> {user.name}
                                </Link>
                                <button onClick={handleLogout} className="text-ink-700/60 hover:text-red-700 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg" title={t("nav.logOut", "Log out")} aria-label={t("nav.logOut", "Log out")}>
                                    <LogOut className="w-4 h-4" aria-hidden="true" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 border-l border-sand-300 pl-4">
                                <Link to="/login" className="text-sm font-medium text-ink-700 hover:text-navy-800 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-navy-700 rounded-lg px-2 py-1">
                                    <LogIn className="w-4 h-4" aria-hidden="true" /> {t("nav.signIn", "Sign In")}
                                </Link>
                                <Link to="/register" className="text-xs font-medium bg-navy-800 text-white px-3 py-1.5 rounded-lg hover:bg-navy-900 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-700 focus:ring-offset-1">
                                    {t("nav.createAccount", "Create Account")}
                                </Link>
                            </div>
                        )}

                        {/* Language Selector (W3C i18n & ISO 639-1 / ISO 3166-1) */}
                        <button
                            onClick={toggleLanguage}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-sand-300 text-ink-700 hover:text-navy-800 hover:bg-cream-200 focus:outline-none focus:ring-2 focus:ring-navy-700 min-h-[44px] min-w-[44px] justify-center transition-colors"
                            aria-label={language === "es" ? "Cambiar idioma a Inglés (EN)" : "Switch language to Spanish (ES)"}
                            title={language === "es" ? "Idioma actual: Español (CR)" : "Current language: English (US)"}
                        >
                            <Globe className="w-4 h-4" aria-hidden="true" />
                            <span className="uppercase">{language}</span>
                        </button>

                        {/* Theme Toggle (Light / Dark) */}
                        <button
                            onClick={toggleTheme}
                            className="text-ink-700 hover:text-navy-800 transition-colors p-2 rounded-xl hover:bg-cream-200 focus:outline-none focus:ring-2 focus:ring-navy-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {theme === "dark" ? (
                                <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
                            ) : (
                                <Moon className="w-5 h-5 text-ink-700" aria-hidden="true" />
                            )}
                        </button>
                    </div>

                    {/* Mobile menu and actions */}
                    <div className="md:hidden flex items-center space-x-1">
                        {(!user || isCustomer) && (
                            <Link
                                to={user ? "/cart" : "/login"}
                                className="text-ink-700 hover:text-navy-800 p-2.5 transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-label="View cart"
                                title={user ? "View cart" : "Sign in to view cart"}
                            >
                                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                            </Link>
                        )}
                        <button
                            onClick={toggleLanguage}
                            className="text-ink-700 hover:text-navy-800 p-2 transition-colors rounded-xl border border-sand-300 text-xs font-bold min-h-[44px] min-w-[44px] flex items-center justify-center gap-1"
                            aria-label={language === "es" ? "Cambiar idioma a Inglés (EN)" : "Switch language to Spanish (ES)"}
                            title={language === "es" ? "Idioma actual: Español (CR)" : "Current language: English (US)"}
                        >
                            <Globe className="w-4 h-4" aria-hidden="true" />
                            <span className="uppercase">{language}</span>
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="text-ink-700 hover:text-navy-800 p-2 transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {theme === "dark" ? (
                                <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
                            ) : (
                                <Moon className="w-5 h-5 text-ink-700" aria-hidden="true" />
                            )}
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="text-ink-700 hover:text-ink-900 p-2 focus:outline-none focus:ring-2 focus:ring-navy-700 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
                        >
                            {isMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
                        </button>
                    </div>
                </div>

            {/* Mobile dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-cream-50 border-t border-sand-300 shadow-lg absolute w-full z-40" id="mobile-menu">
                    <div className="px-4 py-3 space-y-2">
                        <Link to="/catalog" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-navy-800 rounded-lg">{t("nav.catalog", "Catalog")}</Link>
                        <Link to="/about" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-navy-800 rounded-lg">{t("nav.about", "About")}</Link>
                        <Link to="/contact" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-navy-800 rounded-lg">{t("nav.contact", "Contact")}</Link>
                        {isAdmin && (
                            <Link to="/admin" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-navy-800 rounded-lg">{t("nav.admin", "Admin")}</Link>
                        )}

                        <div className="border-t border-sand-300 my-2"></div>

                        {user ? (
                            <>
                                <Link to="/perfil" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 rounded-lg flex items-center gap-2">
                                    <User className="w-4 h-4" aria-hidden="true" /> {t("nav.myProfile", "My Profile")}
                                </Link>
                                {isCustomer && (
                                    <Link to="/cart" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 rounded-lg flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4" aria-hidden="true" /> {t("nav.myCart", "My Cart")}
                                    </Link>
                                )}
                                <button onClick={() => { handleLogout(); toggleMenu(); }} className="block w-full text-left px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2">
                                    <LogOut className="w-4 h-4" aria-hidden="true" /> {t("nav.logOut", "Log Out")}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/cart" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 rounded-lg flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4" aria-hidden="true" /> {t("nav.myCart", "My Cart")}
                                </Link>
                                <Link to="/login" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200 rounded-lg flex items-center gap-2">
                                    <LogIn className="w-4 h-4" aria-hidden="true" /> {t("nav.signIn", "Sign In")}
                                </Link>
                                <Link to="/register" onClick={toggleMenu} className="block px-3 py-2 text-sm font-medium text-navy-800 hover:bg-cream-200 rounded-lg">{t("nav.createAccount", "Create Account")}</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
            </nav>
        </header>
    );
}
