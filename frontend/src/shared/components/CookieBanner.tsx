import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../lib/i18n-context";

export default function CookieBanner() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(() => {
        return localStorage.getItem("cookieConsent") === null;
    });

    const acceptCookies = () => {
        localStorage.setItem("cookieConsent", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <section
            role="region"
            aria-label={t("cookie.privacy", "Cookie consent banner")}
            className="fixed bottom-0 left-0 right-0 bg-slate-900 dark:bg-slate-950 text-white p-4 shadow-lg z-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-700 dark:border-slate-800"
        >
            <p className="text-sm text-slate-100 leading-relaxed">
                {t("cookie.text", "We use cookies to improve your experience. By continuing to visit this site you agree to our use of cookies.")}
            </p>
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-3 shrink-0">
                <Link
                    to="/privacy"
                    className="border border-sand-400 hover:border-white text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 min-h-[44px] flex items-center justify-center"
                >
                    {t("cookie.privacy", "Privacy Policy")}
                </Link>
                <button
                    onClick={acceptCookies}
                    className="bg-accent-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-accent-600 transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 min-h-[44px] flex items-center justify-center"
                >
                    {t("cookie.accept", "Accept Cookies")}
                </button>
            </div>
        </section>
    );
}
