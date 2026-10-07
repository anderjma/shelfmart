// This file hosts the system's static corporate information in the footer.
import { Link } from "react-router-dom";
import { SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";
import { Store } from "lucide-react";

// This component displays the copyright notice, policies, and quick links below.
export default function Footer() {
    return (
        <footer className="bg-cream-50 dark:bg-slate-900 border-t border-sand-300 dark:border-slate-800 mt-auto transition-colors" role="contentinfo" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center text-center space-y-6">

                {/* Brand identity */}
                <div className="flex flex-col items-center space-y-2 max-w-md">
                    <span className="text-xl font-bold text-navy-800 dark:text-accent-400 flex items-center gap-2">
                        <Store className="w-6 h-6" aria-hidden="true" />
                        ShelfMart
                    </span>
                </div>

                {/* Quick links */}
                <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
                    <Link to="/catalog" className="text-ink-700 dark:text-slate-300 hover:text-navy-800 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-lg px-2 py-1 min-h-[44px] flex items-center">Catalog</Link>
                    <Link to="/about" className="text-ink-700 dark:text-slate-300 hover:text-navy-800 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-lg px-2 py-1 min-h-[44px] flex items-center">About</Link>
                    <Link to="/contact" className="text-ink-700 dark:text-slate-300 hover:text-navy-800 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-lg px-2 py-1 min-h-[44px] flex items-center">Contact</Link>
                    <Link to="/privacy" className="text-ink-700 dark:text-slate-300 hover:text-navy-800 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-lg px-2 py-1 min-h-[44px] flex items-center">Privacy Policy</Link>
                </nav>

                {/* Social media */}
                <div className="flex space-x-4 justify-center" aria-label="Social media links">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-ink-700 dark:text-slate-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="ShelfMart Facebook page">
                        <SiFacebook className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-ink-700 dark:text-slate-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="ShelfMart Instagram profile">
                        <SiInstagram className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-ink-700 dark:text-slate-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="ShelfMart TikTok profile">
                        <SiTiktok className="h-5 w-5" aria-hidden="true" />
                    </a>
                </div>

                <div className="border-t border-sand-300 dark:border-slate-800 pt-6 w-full flex flex-col sm:flex-row justify-between items-center text-xs text-ink-700 dark:text-slate-400 gap-2">
                    <p>
                        &copy; {new Date().getFullYear()} ShelfMart. All rights reserved.
                    </p>
                    <p className="font-semibold tracking-wide uppercase bg-cream-200 dark:bg-slate-800 text-ink-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-sand-300 dark:border-slate-700 text-xs">
                        Anderson Jesús Monge Alvarado
                    </p>
                </div>

            </div>
        </footer>
    );
}
