import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "shelfmart_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === "undefined") return "light";
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved === "light" || saved === "dark") return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            root.setAttribute("data-theme", "dark");
        } else {
            root.classList.remove("dark");
            root.setAttribute("data-theme", "light");
        }
        localStorage.setItem(THEME_STORAGE_KEY, theme);

        // Sync favicon with theme
        const faviconSvg = theme === "dark" ? "/favicon-dark.svg" : "/favicon-light.svg";
        const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
        iconLinks.forEach(link => {
            link.href = `${faviconSvg}?v=${theme}`;
            if (link.type !== "image/svg+xml") {
                link.type = "image/svg+xml";
            }
        });
    }, [theme]);

    const toggleTheme = () => {
        setThemeState(prev => (prev === "dark" ? "light" : "dark"));
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
