import { useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import type { Product } from "../../../store/types";
import { createCategory } from "../api/categoryService";
import type { Category } from "../api/categoryService";
import type { ProductPayload } from "../api/adminProductService";
import { getErrorMessage } from "../../../../lib/http-error";

export interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: ProductPayload) => Promise<void>;
    categories: Category[];
    onCategoryCreated?: (newCategory: Category) => void;
    product?: Product | null;
}

const inputClasses =
    "mt-1 block w-full px-3 py-2 border border-sand-400 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 sm:text-sm";
const labelClasses = "block text-sm font-medium text-ink-700";

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

export default function ProductFormModal({ isOpen, onClose, onSubmit, categories, onCategoryCreated, product }: ProductFormModalProps) {
    const [createdCategories, setCreatedCategories] = useState<Category[]>([]);
    const [form, setForm] = useState<ProductPayload>(() => toFormState(product, categories));
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Sub-modal state for creating a new category
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryError, setNewCategoryError] = useState("");
    const [creatingCategory, setCreatingCategory] = useState(false);

    const availableCategories = [
        ...categories,
        ...createdCategories.filter((c) => !categories.some((cat) => cat.name.toLowerCase() === c.name.toLowerCase()))
    ];

    const handleCreateCategory = async (e?: FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = newCategoryName.trim();
        if (!trimmed) {
            setNewCategoryError("Category name cannot be empty.");
            return;
        }

        setCreatingCategory(true);
        setNewCategoryError("");

        try {
            const created = await createCategory(trimmed);
            toast.success(`Category "${created.name}" created successfully.`);
            setCreatedCategories((prev) => [...prev, created]);
            onCategoryCreated?.(created);
            setForm((prev) => ({ ...prev, category: created.name }));
            setNewCategoryName("");
            setIsAddCategoryOpen(false);
        } catch (err) {
            setNewCategoryError(getErrorMessage(err, "Could not create category."));
        } finally {
            setCreatingCategory(false);
        }
    };

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
        <>
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
                {error && <div className="text-red-700 text-sm text-center bg-red-50 p-3 rounded-xl" role="alert">{error}</div>}

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
                    <div className="flex items-center justify-between">
                        <label htmlFor="product-category" className={labelClasses}>Category</label>
                        <button
                            type="button"
                            onClick={() => {
                                setNewCategoryName("");
                                setNewCategoryError("");
                                setIsAddCategoryOpen(true);
                            }}
                            className="text-xs font-semibold text-accent-600 hover:text-accent-700 hover:underline focus:outline-none focus:ring-2 focus:ring-accent-500 rounded px-1"
                        >
                            + New Category
                        </button>
                    </div>
                    <select
                        id="product-category"
                        required
                        className={`${inputClasses} bg-white`}
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                        <option value="" disabled>Select a category</option>
                        {availableCategories.map((c) => (
                            <option key={c.categoryId || c.name} value={c.name}>
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

        {isAddCategoryOpen && (
            <Modal
                isOpen={isAddCategoryOpen}
                onClose={() => {
                    setIsAddCategoryOpen(false);
                    setNewCategoryError("");
                }}
                title="Add New Category"
                size="sm"
                footer={
                    <>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setIsAddCategoryOpen(false);
                                setNewCategoryError("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => void handleCreateCategory()}
                            isLoading={creatingCategory}
                        >
                            Create Category
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleCreateCategory} className="space-y-4">
                    {newCategoryError && (
                        <div className="text-red-700 text-sm text-center bg-red-50 p-2.5 rounded-xl" role="alert">
                            {newCategoryError}
                        </div>
                    )}
                    <div>
                        <label htmlFor="new-category-name" className={labelClasses}>
                            Category Name
                        </label>
                        <input
                            id="new-category-name"
                            type="text"
                            required
                            placeholder="e.g. Footwear"
                            className={inputClasses}
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            autoFocus
                        />
                    </div>
                </form>
            </Modal>
        )}
        </>
    );
}
