import { useState } from "react";
import { Link } from "react-router-dom";

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(() => {
        return localStorage.getItem("cookieConsent") === null;
    });

    const acceptCookies = () => {
        localStorage.setItem("cookieConsent", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-ink-900 text-white p-4 shadow-lg z-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <p className="text-sm text-slate-100">
                We use cookies to improve your experience. By continuing to visit this site you agree to our use of cookies.
            </p>
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-3 shrink-0">
                <Link
                    to="/privacy"
                    className="border border-sand-400 hover:border-white text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                    Privacy Policy
                </Link>
                <button
                    onClick={acceptCookies}
                    className="bg-accent-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                    Accept Cookies
                </button>
            </div>
        </div>
    );
}
