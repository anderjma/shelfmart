// This file provides the generic structural wrapper for all pages in the interface.
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Header";
import Footer from "./Footer";
import BackButton from "./BackButton";
import ErrorBoundary from "./ErrorBoundary";
import CookieBanner from "./CookieBanner";
import AcademicNoticeBanner from "./AcademicNoticeBanner";

// This component coordinates the layout of the top navbar, the main content, and the footer.
export default function Layout() {
    return (
        <div className="min-h-screen bg-cream-100 flex flex-col">
            {/* Accessible Skip to main content link (WCAG 2.2 2.4.1 Bypass Blocks) */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-accent-500 text-white px-4 py-2.5 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-transform font-medium"
            >
                Saltar al contenido principal / Skip to main content
            </a>
            {/* Header / Navbar landmark */}
            <Navbar />

            {/* Central container main landmark */}
            <main
                role="main"
                className="flex-grow w-full max-w-7xl mx-auto py-4 sm:py-6 focus:outline-none"
                id="main-content"
                tabIndex={-1}
            >
                <div className="px-4 sm:px-6 lg:px-8">
                    <BackButton />
                </div>
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </main>

            {/* Footer */}
            <Footer />
            
            {/* Cookie Banner */}
            <CookieBanner />

            {/* Dismissible Academic Notice Popup Banner */}
            <AcademicNoticeBanner />
        </div>
    );
}
