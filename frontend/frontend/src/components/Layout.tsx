// Este archivo provee la envoltura estructural genérica para todas las páginas de la interfaz.
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Este componente coordina la disposición del navbar superior, el contenido principal y el pie de página.
export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Enlace de salto */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
                Saltar al contenido principal
            </a>
            {/* Navbar */}
            <Navbar />
            
            {/* Contenedor central */}
            <main className="flex-grow w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" id="main-content" tabIndex={-1}>
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
