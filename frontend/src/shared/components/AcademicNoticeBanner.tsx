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
            className="fixed top-20 sm:top-24 right-4 sm:right-6 max-w-md w-[calc(100%-2rem)] sm:w-96 bg-white border border-sand-300 rounded-2xl shadow-xl z-40 p-4 transition-all"
        >
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-accent-50 text-accent-600 shrink-0">
                    <GraduationCap className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0 pr-1">
                    <h3 className="text-sm font-semibold text-ink-900">
                        Academic Project Notice
                    </h3>
                    <p className="mt-1 text-xs text-ink-600 leading-relaxed">
                        This store is a portfolio and academic demonstration project. Orders, transactions, and inventory are simulated.
                    </p>
                    <div className="mt-3 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="text-xs font-semibold px-3 py-1.5 bg-sand-200 hover:bg-sand-300 text-ink-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleDismiss}
                    aria-label="Dismiss academic notice"
                    className="text-ink-400 hover:text-ink-700 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                    <X className="w-4 h-4" aria-hidden="true" />
                </button>
            </div>
        </aside>
    );
}
