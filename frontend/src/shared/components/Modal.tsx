import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: ModalSize;
}

const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl"
};

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({ isOpen, onClose, title, children, footer, size = "md" }: ModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);

    // Move focus into the dialog on open and restore it to the triggering element on close,
    // per the WAI-ARIA Dialog (Modal) pattern.
    useEffect(() => {
        if (!isOpen) return;

        previouslyFocusedElement.current = document.activeElement as HTMLElement | null;

        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        (focusable?.[0] ?? dialogRef.current)?.focus();

        return () => {
            previouslyFocusedElement.current?.focus();
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
                return;
            }

            if (event.key !== "Tab" || !dialogRef.current) return;

            const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            // Trap Tab/Shift+Tab within the dialog so keyboard focus can't escape to the page behind it.
            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="presentation"
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} flex flex-col max-h-[85vh] focus:outline-none`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-sand-300">
                    <h2 className="text-lg font-medium text-ink-900">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-ink-700/60 hover:text-ink-900 hover:bg-cream-100 transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">{children}</div>

                {footer && (
                    <div className="flex justify-end gap-2 px-6 py-4 border-t border-sand-300">{footer}</div>
                )}
            </div>
        </div>
    );
}
