import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import SEO from "../../../../shared/components/SEO";
import Button from "../../../../shared/components/Button";
import Table from "../../../../shared/components/Table";
import type { TableColumn } from "../../../../shared/components/Table";
import Pagination from "../../../../shared/components/Pagination";
import { getProducts } from "../../../store/api/productService";
import type { Product } from "../../../store/types";
import { getCategories } from "../api/categoryService";
import type { Category } from "../api/categoryService";
import { createProduct, updateProduct, deleteProduct } from "../api/adminProductService";
import type { ProductPayload } from "../api/adminProductService";
import ProductFormModal from "./ProductFormModal";
import DeleteProductDialog from "./DeleteProductDialog";
import { getErrorMessage } from "../../../../lib/http-error";
import { formatCurrency } from "../../../../shared/utils/formatCurrency";
import AdminNav from "../../components/AdminNav";

const PAGE_SIZE = 10;

export default function ProductsAdmin() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getProducts({ page, pageSize: PAGE_SIZE });
                if (result.totalPages > 0 && page > result.totalPages) {
                    setPage(result.totalPages);
                    return;
                }
                setProducts(result.items);
                setTotalPages(result.totalPages);
            } catch (err) {
                const message = getErrorMessage(err, "Could not load the product catalog.");
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        void loadProducts();
    }, [page, refreshKey]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                toast.error(getErrorMessage(err, "Could not load categories."));
            }
        };

        void loadCategories();
    }, []);

    const refresh = () => setRefreshKey((key) => key + 1);

    const openCreateForm = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const openEditForm = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleSubmit = async (payload: ProductPayload) => {
        if (editingProduct) {
            await updateProduct(editingProduct.productResourceId, payload);
            toast.success("Product updated successfully.");
        } else {
            await createProduct(payload);
            toast.success("Product created successfully.");
        }
        refresh();
    };

    const handleDelete = async (product: Product) => {
        try {
            await deleteProduct(product.productResourceId);
            toast.success("Product deactivated successfully.");
            refresh();
        } catch (err) {
            toast.error(getErrorMessage(err, "Could not deactivate the product."));
        }
    };

    const columns: TableColumn<Product>[] = [
        { key: "name", header: "Name" },
        { key: "category", header: "Category" },
        {
            key: "stock",
            header: "Stock",
            render: (p) => (p.stock <= 5 ? <span className="text-amber-600 font-medium">{p.stock}</span> : p.stock)
        },
        { key: "price", header: "Price", render: (p) => formatCurrency(p.price) },
        {
            key: "actions",
            header: "Actions",
            render: (p) => (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => openEditForm(p)}
                        className="text-slate-500 hover:text-blue-600 transition-colors"
                        aria-label={`Edit ${p.name}`}
                    >
                        <Pencil className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                        onClick={() => setProductPendingDelete(p)}
                        className="text-slate-500 hover:text-red-600 transition-colors"
                        aria-label={`Deactivate ${p.name}`}
                    >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO title="Manage Products" description="Create, edit, and deactivate catalog products." />

            <AdminNav />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Button onClick={openCreateForm}>
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    New Product
                </Button>
            </div>

            {error && !loading && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded mb-4">{error}</div>
            )}

            <Table
                columns={columns}
                data={products}
                keyExtractor={(p) => p.productResourceId}
                isLoading={loading}
                emptyMessage="No products available."
            />

            {!loading && (
                <div className="mt-4">
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
            )}

            <ProductFormModal
                key={editingProduct?.productResourceId ?? "new"}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                categories={categories}
                product={editingProduct}
            />

            <DeleteProductDialog
                product={productPendingDelete}
                onClose={() => setProductPendingDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
