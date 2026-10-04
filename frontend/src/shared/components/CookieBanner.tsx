import React, { useState } from "react";

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
        <div className="fixed bottom-0 left-0 right-0 bg-ink-900 text-white p-4 shadow-lg z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
                We use cookies to improve your experience. By continuing to visit this site you agree to our use of cookies.
            </p>
            <button
                onClick={acceptCookies}
                className="bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors whitespace-nowrap"
            >
                Accept Cookies
            </button>
        </div>
    );
}
