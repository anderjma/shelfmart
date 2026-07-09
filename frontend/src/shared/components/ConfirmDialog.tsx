// This file provides a generic, reusable confirmation dialog for destructive or
// consequential actions, replacing ad-hoc window.confirm() calls across the app.
import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import type { ModalSize } from "./Modal";
import type { ButtonVariant } from "./Button";

export interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: ButtonVariant;
    size?: ModalSize;
    onConfirm: () => Promise<void> | void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmVariant = "danger",
    size = "sm",
    onConfirm,
    onCancel
}: ConfirmDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            await onConfirm();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel}
            title={title}
            size={size}
            footer={
                <>
                    <Button variant="secondary" onClick={onCancel} disabled={submitting}>
                        {cancelLabel}
                    </Button>
                    <Button variant={confirmVariant} isLoading={submitting} onClick={handleConfirm}>
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            <p className="text-sm text-gray-600">{message}</p>
        </Modal>
    );
}
