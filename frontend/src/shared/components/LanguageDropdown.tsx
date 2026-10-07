import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../lib/i18n-context";
import { ChevronDown, Check } from "lucide-react";

/**
 * Flag icons rendered as accessible inline SVGs.
 * Spain flag for Spanish (es) and England (St George's Cross) flag for English (en),
 * as explicitly requested.
 */
export function SpainFlag({ className = "w-4 h-3 shrink-0" }: { className?: string }) {
    return (
        <svg
            className={`${className} rounded-[2px] shadow-xs`}
            viewBox="0 0 750 500"
            aria-hidden="true"
        >
            <rect width="750" height="500" fill="#c60b1e" />
            <rect width="750" height="250" y="125" fill="#ffc400" />
        </svg>
    );
}

export function EnglandFlag({ className = "w-4 h-3 shrink-0" }: { className?: string }) {
    return (
        <svg
            className={`${className} rounded-[2px] shadow-xs border border-sand-300 dark:border-slate-700`}
            viewBox="0 0 60 36"
            aria-hidden="true"
        >
            <rect width="60" height="36" fill="#ffffff" />
            <rect x="25" width="10" height="36" fill="#ce1124" />
            <rect y="13" width="60" height="10" fill="#ce1124" />
        </svg>
    );
}

export interface LanguageOption {
    code: "es" | "en";
    label: string;
    flag: typeof SpainFlag;
}

const LANGUAGES: LanguageOption[] = [
    { code: "es", label: "Español", flag: SpainFlag },
    { code: "en", label: "English", flag: EnglandFlag }
];

export default function LanguageDropdown() {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentOption = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];
    const CurrentFlag = currentOption.flag;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleSelect = (code: "es" | "en") => {
        setLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink-700 dark:text-slate-200 hover:text-navy-800 dark:hover:text-white hover:bg-cream-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 min-h-[44px] min-w-[44px] justify-center transition-colors shadow-xs"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={t("nav.selectLanguage", "Select language")}
                title={language === "es" ? "Idioma: Español" : "Language: English"}
            >
                <CurrentFlag className="w-4 h-3 shrink-0" />
                <span className="uppercase tracking-wider">{currentOption.code}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-sand-400 dark:text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    aria-label="Languages"
                    className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-white dark:bg-slate-800 border border-sand-300 dark:border-slate-700 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100"
                >
                    {LANGUAGES.map((option) => {
                        const OptionFlag = option.flag;
                        const isSelected = option.code === language;
                        return (
                            <button
                                key={option.code}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => handleSelect(option.code)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors text-left ${
                                    isSelected
                                        ? "bg-accent-500/10 text-accent-600 dark:text-accent-400 font-semibold"
                                        : "text-ink-700 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-slate-700/60"
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <OptionFlag className="w-4 h-3 shrink-0" />
                                    <span>{option.label}</span>
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-accent-500" aria-hidden="true" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

