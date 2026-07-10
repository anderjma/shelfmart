import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-navy-800 text-white hover:bg-navy-900 focus:ring-navy-700 disabled:bg-navy-800/40 border border-transparent",
    secondary: "bg-white text-ink-900 border border-sand-400 hover:bg-cream-200 focus:ring-navy-700",
    danger: "text-red-700 hover:bg-red-50 border border-transparent focus:ring-red-500",
    ghost: "text-ink-700 hover:text-ink-900 hover:bg-cream-200 border border-transparent focus:ring-navy-700"
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2"
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
            className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            )}
            {children}
        </button>
    );
}
