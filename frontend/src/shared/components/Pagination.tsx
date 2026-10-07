import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../lib/i18n-context";

export interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    const { t } = useLanguage();

    if (totalPages <= 1) return null;

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-between border-t border-sand-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 sm:px-6 rounded-2xl shadow-xs"
        >
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(Math.max(page - 1, 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center justify-center rounded-xl border border-sand-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-ink-700 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                >
                    {t("pagination.previous", "Previous")}
                </button>
                <button
                    onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                    disabled={page === totalPages}
                    className="relative ml-3 inline-flex items-center justify-center rounded-xl border border-sand-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-ink-700 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                >
                    {t("pagination.next", "Next")}
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-ink-700 dark:text-slate-300">
                        {t("pagination.page", "Page")}{" "}
                        <span className="font-semibold text-ink-900 dark:text-white">{page}</span>{" "}
                        {t("pagination.of", "of")}{" "}
                        <span className="font-semibold text-ink-900 dark:text-white">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <div className="isolate inline-flex -space-x-px rounded-xl shadow-xs">
                        <button
                            onClick={() => onPageChange(Math.max(page - 1, 1))}
                            disabled={page === 1}
                            className="relative inline-flex items-center justify-center rounded-l-xl px-3 py-2 text-ink-700/60 dark:text-slate-400 ring-1 ring-inset ring-sand-300 dark:ring-slate-700 hover:bg-cream-100 dark:hover:bg-slate-800 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px]"
                            aria-label="Previous page"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                            <button
                                key={pNum}
                                onClick={() => onPageChange(pNum)}
                                aria-current={pNum === page ? "page" : undefined}
                                aria-label={`Go to page ${pNum}`}
                                className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold focus:z-20 min-h-[44px] min-w-[44px] transition-colors ${
                                    pNum === page
                                        ? "z-10 bg-accent-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                                        : "text-ink-900 dark:text-slate-200 ring-1 ring-inset ring-sand-300 dark:ring-slate-700 hover:bg-cream-100 dark:hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
                                }`}
                            >
                                {pNum}
                            </button>
                        ))}
                        <button
                            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                            disabled={page === totalPages}
                            className="relative inline-flex items-center justify-center rounded-r-xl px-3 py-2 text-ink-700/60 dark:text-slate-400 ring-1 ring-inset ring-sand-300 dark:ring-slate-700 hover:bg-cream-100 dark:hover:bg-slate-800 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px]"
                            aria-label="Next page"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
