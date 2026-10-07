import { useState } from "react";
import { GraduationCap, X } from "lucide-react";

export default function AcademicNoticeBanner() {
    const [isVisible, setIsVisible] = useState(() => {
        return localStorage.getItem("academicNoticeDismissed") !== "true";
    });

    const handleDismiss = () => {
        localStorage.setItem("academicNoticeDismissed", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <aside
            aria-label="Academic project notice"
            className="fixed top-18 sm:top-24 right-4 sm:right-6 left-4 sm:left-auto max-w-md sm:w-96 bg-white dark:bg-slate-900 border border-sand-300 dark:border-slate-700 rounded-2xl shadow-xl z-40 p-4 transition-all"
        >
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400 shrink-0">
                    <GraduationCap className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0 pr-1">
                    <h3 className="text-sm font-semibold text-ink-900 dark:text-white">
                        Academic Project Notice
                    </h3>
                    <p className="mt-1 text-xs text-ink-700 dark:text-slate-300 leading-relaxed">
                        This store is a portfolio and academic demonstration project. Orders, transactions, and inventory are simulated.
                    </p>
                    <div className="mt-3 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="text-xs font-semibold px-4 py-2 bg-cream-200 dark:bg-slate-800 hover:bg-cream-300 dark:hover:bg-slate-700 text-ink-900 dark:text-slate-200 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 min-h-[36px]"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleDismiss}
                    aria-label="Dismiss academic notice"
                    className="text-ink-700 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white p-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                    <X className="w-4 h-4" aria-hidden="true" />
                </button>
            </div>
        </aside>
    );
}
