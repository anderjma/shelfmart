import { useState } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import type { Product } from "../../../store/types";

export interface DeleteProductDialogProps {
    product: Product | null;
    onClose: () => void;
    onConfirm: (product: Product) => Promise<void>;
}

export default function DeleteProductDialog({ product, onClose, onConfirm }: DeleteProductDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    if (!product) return null;

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            await onConfirm(product);
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={!!product}
            onClose={onClose}
            title="Deactivate Product"
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" isLoading={submitting} onClick={handleConfirm}>
                        Deactivate
                    </Button>
                </>
            }
        >
            <p className="text-sm text-ink-700">
                Are you sure you want to deactivate <span className="font-medium text-ink-900">{product.name}</span>?
                It will be hidden from the storefront but its order history will be preserved.
            </p>
        </Modal>
    );
}
