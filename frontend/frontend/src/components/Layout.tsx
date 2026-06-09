import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Enlace de salto para accesibilidad */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
                Saltar al contenido principal
            </a>
            {/* Navbar modular independiente */}
            <Navbar />
            
            {/* Contenedor central reactivo */}
            <main className="flex-grow w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" id="main-content" tabIndex={-1}>
                <Outlet />
            </main>

            {/* Footer centrado */}
            <Footer />
        </div>
    );
}
