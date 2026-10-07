import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-navy-800 text-white hover:bg-navy-900 focus-visible:ring-navy-700 disabled:bg-navy-800/40 border border-transparent shadow-xs",
    secondary: "bg-white dark:bg-slate-800 text-ink-900 dark:text-slate-100 border border-sand-400 dark:border-slate-600 hover:bg-cream-200 dark:hover:bg-slate-700 focus-visible:ring-navy-700 shadow-xs",
    danger: "text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent focus-visible:ring-red-500",
    ghost: "text-ink-700 dark:text-slate-300 hover:text-ink-900 dark:hover:text-white hover:bg-cream-200 dark:hover:bg-slate-800 border border-transparent focus-visible:ring-navy-700"
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "text-xs px-3 py-1.5 min-h-[36px]",
    md: "text-sm px-4 py-2.5 min-h-[44px]"
};

export default function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled,
    className = "",
    children,
    ...rest
}: ButtonProps) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || isLoading}
            aria-busy={isLoading || undefined}
            {...rest}
        >
            {isLoading && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" aria-hidden="true" />
            )}
            {children}
        </button>
    );
}
