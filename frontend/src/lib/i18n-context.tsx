import React, { createContext, useContext, useEffect, useState } from "react";

export type LanguageCode = "es" | "en";

export interface LanguageContextType {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    toggleLanguage: () => void;
    locale: string;
    dir: "ltr" | "rtl";
    countryCode: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "shelfmart_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<LanguageCode>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === "es" || saved === "en") return saved;
            // Default to Spanish per W3C lang="es" requirement while keeping browser preference fallback
            const navLang = navigator.language?.toLowerCase() || "";
            if (navLang.startsWith("es")) return "es";
            if (navLang.startsWith("en")) return "en";
            return "es";
        } catch {
            return "es";
        }
    });

    const setLanguage = (lang: LanguageCode) => {
        setLanguageState(lang);
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // ignore storage errors
        }
    };

    const toggleLanguage = () => {
        setLanguage(language === "es" ? "en" : "es");
    };

    // Synchronize HTML root attributes (W3C i18n & ISO 639-1)
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = "ltr";
    }, [language]);

    const locale = language === "es" ? "es-CR" : "en-US";
    const countryCode = language === "es" ? "CR" : "US";

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                toggleLanguage,
                locale,
                dir: "ltr",
                countryCode
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext);
    if (!context) {
        // Fallback if rendered outside of LanguageProvider (e.g. in standalone unit tests)
        return {
            language: "en",
            setLanguage: () => {},
            toggleLanguage: () => {},
            locale: "en-US",
            dir: "ltr",
            countryCode: "US"
        };
    }
    return context;
}
