// Este archivo alberga la información corporativa estática al pie de página del sistema.
import React from "react";
import { Link } from "react-router-dom";
import { SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";
import { Store } from "lucide-react";

// Este componente visualiza los derechos de autor, políticas y enlaces rápidos inferiores.
export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Pie de página</h2>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center text-center space-y-6">
                
                {/* Identidad comercial */}
                <div className="flex flex-col items-center space-y-2 max-w-md">
                    <span className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <Store className="w-6 h-6" aria-hidden="true" />
                        Sistema Empresarial
                    </span>
                </div>

                {/* Enlaces rápidos */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
                    <Link to="/catalogo" className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">Catálogo</Link>
                    <Link to="/nosotros" className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">Nosotros</Link>
                    <Link to="/contacto" className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">Contacto</Link>
                </div>

                {/* Redes sociales */}
                <div className="flex space-x-6 justify-center">
                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1" aria-label="Ir a nuestro Facebook">
                        <SiFacebook className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1" aria-label="Ir a nuestro Instagram">
                        <SiInstagram className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1" aria-label="Ir a nuestro TikTok">
                        <SiTiktok className="h-5 w-5" aria-hidden="true" />
                    </a>
                </div>

                {/* Derechos de autor */}
                <div className="border-t border-gray-100 pt-6 w-full flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
                    <p>
                        &copy; {new Date().getFullYear()} Sistema Empresarial. Todos los derechos reservados.
                    </p>
                    <p className="font-semibold tracking-wide uppercase bg-gray-50 px-2 py-1 rounded border border-gray-200/50 text-[10px]">
                        Anderson Jesús Monge Alvarado
                    </p>
                </div>

            </div>
        </footer>
    );
}
