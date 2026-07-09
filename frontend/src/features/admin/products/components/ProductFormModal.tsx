import { useState } from "react";
import type { FormEvent } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import type { Product } from "../../../store/types";
import type { Category } from "../api/categoryService";
import type { ProductPayload } from "../api/adminProductService";
import { getErrorMessage } from "../../../../lib/http-error";

export interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: ProductPayload) => Promise<void>;
    categories: Category[];
    product?: Product | null;
}

const inputClasses =
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
const labelClasses = "block text-sm font-medium text-gray-700";

function toFormState(product: Product | null | undefined, categories: Category[]): ProductPayload {
    if (product) {
        return {
            name: product.name,
            stock: product.stock,
            price: product.price,
            imageUrl: product.imageUrl ?? "",
            category: product.category,
            discountPercentage: product.discountPercentage
        };
    }

    return {
        name: "",
        stock: 0,
        price: 0,
        imageUrl: "",
        // Default to the first category from the real catalog instead of a hardcoded name,
        // since a hardcoded value could stop existing in Categories and break product creation.
        category: categories[0]?.name ?? "",
        discountPercentage: 0
    };
}

export default function ProductFormModal({ isOpen, onClose, onSubmit, categories, product }: ProductFormModalProps) {
    const [form, setForm] = useState<ProductPayload>(() => toFormState(product, categories));
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await onSubmit(form);
            onClose();
        } catch (err) {
            setError(getErrorMessage(err, "Could not save the product."));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={product ? "Edit Product" : "New Product"}
            size="md"
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="product-form" isLoading={submitting}>
                        {product ? "Save Changes" : "Create Product"}
                    </Button>
                </>
            }
        >
            <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded" role="alert">{error}</div>}

                <div>
                    <label htmlFor="product-name" className={labelClasses}>Name</label>
                    <input
                        id="product-name"
                        type="text"
                        required
                        className={inputClasses}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="product-stock" className={labelClasses}>Stock</label>
                        <input
                            id="product-stock"
                            type="number"
                            min={0}
                            required
                            className={inputClasses}
                            value={form.stock}
                            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label htmlFor="product-price" className={labelClasses}>Price</label>
                        <input
                            id="product-price"
                            type="number"
                            min={0}
                            step="0.01"
                            required
                            className={inputClasses}
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="product-category" className={labelClasses}>Category</label>
                    <select
                        id="product-category"
                        className={inputClasses}
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                        {categories.length === 0 && <option value={form.category}>{form.category}</option>}
                        {categories.map((c) => (
                            <option key={c.categoryId} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="product-image-url" className={labelClasses}>Image URL</label>
                    <input
                        id="product-image-url"
                        type="text"
                        className={inputClasses}
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="product-discount" className={labelClasses}>Discount Percentage</label>
                    <input
                        id="product-discount"
                        type="number"
                        min={0}
                        max={100}
                        step="0.01"
                        className={inputClasses}
                        value={form.discountPercentage}
                        onChange={(e) => setForm({ ...form, discountPercentage: Number(e.target.value) })}
                    />
                </div>
            </form>
        </Modal>
    );
}
