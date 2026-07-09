// This file provides the generic structural wrapper for all pages in the interface.
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Header";
import Footer from "./Footer";
import BackButton from "./BackButton";
import ErrorBoundary from "./ErrorBoundary";

// This component coordinates the layout of the top navbar, the main content, and the footer.
export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Skip link */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
                Skip to main content
            </a>
            {/* Navbar */}
            <Navbar />

            {/* Central container */}
            <main className="flex-grow w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" id="main-content" tabIndex={-1}>
                <BackButton />
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
