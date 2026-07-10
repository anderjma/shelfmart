// This file hosts the system's static corporate information in the footer.
import React from "react";
import { Link } from "react-router-dom";
import { SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";
import { Store } from "lucide-react";

// This component displays the copyright notice, policies, and quick links below.
export default function Footer() {
    return (
        <footer className="bg-cream-50 border-t border-sand-300 mt-auto" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center text-center space-y-6">

                {/* Brand identity */}
                <div className="flex flex-col items-center space-y-2 max-w-md">
                    <span className="text-xl font-semibold text-navy-800 flex items-center gap-2">
                        <Store className="w-6 h-6" aria-hidden="true" />
                        ShelfMart
                    </span>
                </div>

                {/* Quick links */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
                    <Link to="/catalog" className="text-ink-700 hover:text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-700 rounded-lg px-1">Catalog</Link>
                    <Link to="/about" className="text-ink-700 hover:text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-700 rounded-lg px-1">About</Link>
                    <Link to="/contact" className="text-ink-700 hover:text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-700 rounded-lg px-1">Contact</Link>
                </div>

                {/* Social media */}
                <div className="flex space-x-6 justify-center">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-ink-700/60 hover:text-accent-500 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-lg" aria-label="Facebook">
                        <SiFacebook className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-ink-700/60 hover:text-accent-500 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-lg" aria-label="Instagram">
                        <SiInstagram className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-ink-700/60 hover:text-accent-500 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-lg" aria-label="TikTok">
                        <SiTiktok className="h-5 w-5" aria-hidden="true" />
                    </a>
                </div>

                {/* Copyright */}
                <div className="border-t border-sand-300 pt-6 w-full flex flex-col sm:flex-row justify-between items-center text-xs text-ink-700/70 gap-2">
                    <p>
                        &copy; {new Date().getFullYear()} ShelfMart. All rights reserved.
                    </p>
                    <p className="font-semibold tracking-wide uppercase bg-cream-200 text-ink-700 px-2 py-1 rounded-lg border border-sand-300 text-[10px]">
                        Anderson Jesús Monge Alvarado
                    </p>
                </div>

            </div>
        </footer>
    );
}
