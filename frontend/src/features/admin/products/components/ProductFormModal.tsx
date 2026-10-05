import { useState, useRef } from "react";
import type { FormEvent, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Trash2 } from "lucide-react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import type { Product } from "../../../store/types";
import { createCategory } from "../api/categoryService";
import type { Category } from "../api/categoryService";
import { uploadProductImage } from "../api/adminProductService";
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
        category: categories[0]?.name ?? "",
        discountPercentage: 0
    };
}

export default function ProductFormModal({ isOpen, onClose, onSubmit, categories, onCategoryCreated, product }: ProductFormModalProps) {
    const [createdCategories, setCreatedCategories] = useState<Category[]>([]);
    const [form, setForm] = useState<ProductPayload>(() => toFormState(product, categories));
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Number field state to avoid "0" getting stuck when typing
    const [numbers, setNumbers] = useState({
        stock: product ? String(product.stock) : "0",
        price: product ? String(product.price) : "0",
        discount: product ? String(product.discountPercentage) : "0"
    });

    const setNumber = (field: "stock" | "price" | "discount", rawValue: string) => {
        let clean = rawValue;
        // Strip leading zeros if more digits are typed: e.g. "05" -> "5"
        if (/^0+[1-9]/.test(clean)) {
            clean = clean.replace(/^0+/, "");
        } else if (/^0{2,}$/.test(clean)) {
            clean = "0";
        }
        setNumbers((prev) => ({ ...prev, [field]: clean }));

        const num = clean === "" ? 0 : Number(clean);
        if (!isNaN(num)) {
            if (field === "stock") setForm((f) => ({ ...f, stock: Math.max(0, Math.floor(num)) }));
            if (field === "price") setForm((f) => ({ ...f, price: Math.max(0, num) }));
            if (field === "discount") setForm((f) => ({ ...f, discountPercentage: Math.min(100, Math.max(0, num)) }));
        }
    };

    const commitNumber = (field: "stock" | "price" | "discount") => {
        setNumbers((prev) => {
            const current = prev[field].trim();
            if (current === "" || isNaN(Number(current))) {
                return { ...prev, [field]: "0" };
            }
            return { ...prev, [field]: String(Number(current)) };
        });
    };

    // Local file upload state for Supabase
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl ?? "");
    const [imageError, setImageError] = useState<string>("");
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setImageError("");
        const file = e.target.files?.[0];
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setImageError("Only JPG, PNG or WebP images are supported.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setImageError("The image must be 5 MB or smaller.");
            return;
        }

        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setImagePreview("");
        setImageError("");
        setForm((prev) => ({ ...prev, imageUrl: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

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
            let finalImageUrl = form.imageUrl;
            if (selectedFile) {
                setUploadingImage(true);
                try {
                    finalImageUrl = await uploadProductImage(selectedFile);
                } catch (uploadErr) {
                    setError(getErrorMessage(uploadErr, "Could not upload image to Supabase."));
                    setSubmitting(false);
                    setUploadingImage(false);
                    return;
                }
                setUploadingImage(false);
            }

            await onSubmit({
                ...form,
                imageUrl: finalImageUrl
            });
            onClose();
        } catch (err) {
            setError(getErrorMessage(err, "Could not save the product."));
        } finally {
            setSubmitting(false);
            setUploadingImage(false);
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
                    <Button type="submit" form="product-form" isLoading={submitting || uploadingImage}>
                        {uploadingImage ? "Uploading..." : product ? "Save Changes" : "Create Product"}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="product-stock" className={labelClasses}>Stock</label>
                        <input
                            id="product-stock"
                            type="text"
                            inputMode="numeric"
                            pattern="\d+"
                            required
                            className={inputClasses}
                            value={numbers.stock}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => setNumber("stock", e.target.value)}
                            onBlur={() => commitNumber("stock")}
                        />
                    </div>
                    <div>
                        <label htmlFor="product-price" className={labelClasses}>Price</label>
                        <input
                            id="product-price"
                            type="text"
                            inputMode="decimal"
                            pattern="\d+(\.\d{1,2})?"
                            required
                            className={inputClasses}
                            value={numbers.price}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => setNumber("price", e.target.value)}
                            onBlur={() => commitNumber("price")}
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
                    <span id="product-image-label" className={labelClasses}>Image</span>
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="w-full sm:w-28 h-40 sm:h-28 shrink-0 rounded-xl border border-dashed border-sand-400 bg-cream-50 flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Selected product preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImagePlus className="w-8 h-8 text-sand-400" aria-hidden="true" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                            <input
                                ref={fileInputRef}
                                id="product-image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                aria-labelledby="product-image-label"
                                aria-describedby="product-image-hint"
                                className="sr-only"
                                onChange={handleImageChange}
                            />
                            <div className="flex flex-wrap gap-2">
                                <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                                    {imagePreview ? "Change Image" : "Choose Image"}
                                </Button>
                                {imagePreview && (
                                    <Button type="button" variant="secondary" onClick={handleRemoveImage}>
                                        <Trash2 className="w-4 h-4 mr-1" aria-hidden="true" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <p id="product-image-hint" className="text-xs text-ink-700/70">
                                JPEG, PNG or WebP, up to 5 MB.
                            </p>
                            {imageError && (
                                <p className="text-xs text-red-700" role="alert">{imageError}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="product-discount" className={labelClasses}>Discount Percentage</label>
                    <input
                        id="product-discount"
                        type="text"
                        inputMode="decimal"
                        pattern="\d{1,3}(\.\d{1,2})?"
                        className={inputClasses}
                        value={numbers.discount}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setNumber("discount", e.target.value)}
                        onBlur={() => commitNumber("discount")}
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
