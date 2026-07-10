// This file renders the virtual storefront where customers can browse the item catalog.
import { useEffect, useState } from "react";
import { getProducts } from "../api/productService";
import { getCategories } from "../../admin/products/api/categoryService";
import { addToCart } from "../../cart/api/orderService";
import type { Product } from "../types";
import toast from "react-hot-toast";
import { ShoppingCart, Search } from "lucide-react";
import SEO from "../../../shared/components/SEO";
import Pagination from "../../../shared/components/Pagination";
import { getErrorMessage } from "../../../lib/http-error";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

const PAGE_SIZE = 8;
const SEARCH_DEBOUNCE_MS = 300;

// This component displays products in a grid filterable by category and includes the add-to-cart action.
export default function Store() {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // Debounce free-text search so every keystroke doesn't trigger a request.
    useEffect(() => {
        const handle = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(handle);
    }, [searchInput]);

    // Load the category list once; it's independent of the current page/filter.
    // Same source (/api/Categories) used by the admin product form, so the store
    // filter and the admin category picker never drift apart.
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(["All", ...data.map((c) => c.name)]);
            } catch {
                toast.error("Error loading categories.");
            }
        };
        fetchCategories();
    }, []);

    // Fetch the current page of products from the server whenever page/filters change.
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const category = selectedCategory === "All" ? undefined : selectedCategory;
                const search = searchTerm.trim() === "" ? undefined : searchTerm.trim();
                const result = await getProducts({ page, pageSize: PAGE_SIZE, search, category });
                setProducts(result.items);
                setTotalCount(result.totalCount);
                setTotalPages(result.totalPages || 1);
            } catch {
                toast.error("Error loading products.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page, selectedCategory, searchTerm]);

    const handleAddToCart = async (productId: string) => {
        try {
            await addToCart({ productId, quantity: 1 });
            toast.success("Product added to cart");
        } catch (err) {
            toast.error(getErrorMessage(err, "You must sign in to purchase."));
        }
    };

    const renderBadges = (product: Product) => {
        const isNew = product.createdAt && (new Date().getTime() - new Date(product.createdAt).getTime()) / (1000 * 3600 * 24) <= 7;

        if (product.stock === 0) return <span className="bg-ink-900 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm">Sold Out</span>;
        if (product.stock > 0 && product.stock <= 5) return <span className="bg-ink-900 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm">Only {product.stock} left!</span>;
        if (product.discountPercentage > 0) return <span className="bg-accent-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm">-{product.discountPercentage}% OFF</span>;
        if (isNew) return <span className="bg-white text-accent-500 border border-accent-500 text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm">New</span>;
        return null;
    };

    // This component represents the visual skeleton while data is loading.
    const ProductSkeleton = () => (
        <div className="bg-white border border-sand-300 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-pulse">
            <div className="h-48 bg-cream-200"></div>
            <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="h-5 bg-cream-200 rounded w-3/4"></div>
                <div className="h-8 bg-cream-200 rounded w-1/3"></div>
                <div className="mt-auto h-10 bg-cream-200 rounded w-full"></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <SEO title="Product Catalog" description="Explore our complete product catalog with real-time stock control and special offers." />
            <div className="text-center space-y-4 mb-8">
                <h1 className="text-3xl font-bold text-ink-900">Product Catalog</h1>
                <p className="text-ink-700">Explore our selection and find what you need.</p>
            </div>

            <div className="space-y-6">
                <div className="max-w-md mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm transition-all"
                    />
                    <Search className="w-5 h-5 text-ink-700/40 absolute left-3 top-3" />
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setSelectedCategory(cat); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 ${
                                selectedCategory === cat ? "bg-accent-500 text-white shadow-sm" : "bg-white text-ink-700 border border-sand-300 hover:bg-cream-100"
                            }`}
                            aria-pressed={selectedCategory === cat}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" aria-busy="true" aria-label="Loading product catalog">
                    {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center p-16 bg-white border border-sand-300 rounded-2xl flex flex-col items-center justify-center">
                    <ShoppingCart className="w-16 h-16 text-sand-400 mb-4" />
                    <h3 className="text-lg font-medium text-ink-900">No products available</h3>
                    <p className="text-ink-700 mt-1">Try selecting a different category.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    <h2 className="sr-only">Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => {
                            const finalPrice = product.discountPercentage > 0
                                ? product.price - (product.price * (product.discountPercentage / 100))
                                : product.price;

                            return (
                                <div key={product.productResourceId} className="bg-white border border-sand-300 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md relative group">
                                    <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10 pointer-events-none">
                                        <span className="bg-ink-900/75 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                                            {product.category || 'General'}
                                        </span>
                                        <div className="flex flex-col gap-1 items-end">
                                            {renderBadges(product)}
                                        </div>
                                    </div>

                                    <div className="h-48 bg-cream-100 flex items-center justify-center overflow-hidden">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                                        ) : (
                                            <span className="text-sand-400 text-sm font-medium">No image</span>
                                        )}
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-ink-900 text-lg mb-1 line-clamp-1" title={product.name}>{product.name}</h3>
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <p className="text-2xl font-bold text-accent-500">{formatCurrency(finalPrice)}</p>
                                            {product.discountPercentage > 0 && <p className="text-sm text-ink-700/50 line-through">{formatCurrency(product.price)}</p>}
                                        </div>

                                        <div className="mt-auto">
                                            {product.stock > 0 ? (
                                                <button
                                                    onClick={() => handleAddToCart(product.productResourceId)}
                                                    className="w-full bg-accent-500 text-white py-2.5 rounded-xl font-medium hover:bg-accent-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                                                    aria-label={`Add ${product.name} to cart`}
                                                >
                                                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                                                </button>
                                            ) : (
                                                <button disabled className="w-full bg-cream-200 text-ink-700/40 py-2.5 rounded-xl font-medium cursor-not-allowed border border-sand-300">
                                                    Sold Out
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-center text-sm text-ink-700">{totalCount} results</p>
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
            )}
        </div>
    );
}
