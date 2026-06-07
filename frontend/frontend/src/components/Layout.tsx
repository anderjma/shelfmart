import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
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
