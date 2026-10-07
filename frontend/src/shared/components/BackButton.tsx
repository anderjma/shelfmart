// This file provides a consistent "go back" affordance reused across every page.
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../../lib/i18n-context";

// Routes with no meaningful "back" target (top-level landing pages).
const HIDDEN_ON = ["/"];

export interface BackButtonProps {
    className?: string;
}

export default function BackButton({ className }: BackButtonProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    if (HIDDEN_ON.includes(location.pathname)) return null;

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleBack}
            aria-label={t("common.back", "Go back to previous page")}
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 rounded-xl px-3 py-2 mb-4 min-h-[44px] ${
                className ?? "text-ink-700 dark:text-slate-300 hover:text-accent-500 dark:hover:text-accent-400 hover:bg-cream-200/50 dark:hover:bg-slate-800"
            }`}
        >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{t("common.back", "Back")}</span>
        </button>
    );
}
