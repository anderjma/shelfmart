// This file hosts the system's static corporate information in the footer.
import React from "react";
import { Link } from "react-router-dom";
import { SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";
import { Store } from "lucide-react";

// This component displays the copyright notice, policies, and quick links below.
export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center text-center space-y-6">

                {/* Brand identity */}
                <div className="flex flex-col items-center space-y-2 max-w-md">
                    <span className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <Store className="w-6 h-6" aria-hidden="true" />
                        ShelfMart
                    </span>
                </div>

                {/* Quick links */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
                    <Link to="/catalog" className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">Catalog</Link>
                    <Link to="/about" className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">About</Link>
                    <Link to="/contact" className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">Contact</Link>
                </div>

                {/* Social media */}
                <div className="flex space-x-6 justify-center">
                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1" aria-label="Go to our Facebook">
                        <SiFacebook className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1" aria-label="Go to our Instagram">
                        <SiInstagram className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1" aria-label="Go to our TikTok">
                        <SiTiktok className="h-5 w-5" aria-hidden="true" />
                    </a>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-100 pt-6 w-full flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
                    <p>
                        &copy; {new Date().getFullYear()} ShelfMart. All rights reserved.
                    </p>
                    <p className="font-semibold tracking-wide uppercase bg-gray-50 px-2 py-1 rounded border border-gray-200/50 text-[10px]">
                        Anderson Jesús Monge Alvarado
                    </p>
                </div>

            </div>
        </footer>
    );
}
