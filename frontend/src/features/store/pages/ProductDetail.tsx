import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getProducts } from "../api/productService";
import { addToCart } from "../../cart/api/orderService";
import { useAuth } from "../../../lib/auth-context";
import type { Product } from "../types";
import SEO from "../../../shared/components/SEO";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { getErrorMessage } from "../../../lib/http-error";
import toast from "react-hot-toast";
import {
    ShoppingCart,
    Plus,
    Minus,
    ArrowLeft,
    Check,
    Truck,
    ShieldCheck,
    RotateCcw,
    AlertCircle
} from "lucide-react";

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, isCustomer } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);

    useEffect(() => {
        if (!id) return;

        let isMounted = true;

        getProductById(id)
            .then(data => {
                if (!isMounted) return;
                setProduct(data);
                setQuantity(1);

                // Fetch related products from same category
                getProducts({ category: data.category, pageSize: 5 })
                    .then(res => {
                        if (!isMounted) return;
                        const items: Product[] = res;
                        setRelatedProducts(items.filter(p => p.productResourceId !== data.productResourceId).slice(0, 4));
                    })
                    .catch(() => {});
            })
            .catch(err => {
                console.error("Error loading product detail", err);
                if (isMounted) setProduct(null);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleQuantityChange = (delta: number) => {
        if (!product) return;
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= Math.max(1, product.stock)) {
            setQuantity(newQty);
        }
    };

    const handleAddToCart = async (redirectToCart = false) => {
        if (!product) return;

        if (!isAuthenticated) {
            toast.error("Please sign in to add items to your cart.");
            navigate("/login");
            return;
        }

        if (!isCustomer) {
            toast.error("Admin accounts cannot make purchases.");
            return;
        }

        if (redirectToCart) setBuyingNow(true);
        else setAdding(true);

        try {
            await addToCart({ productId: product.productResourceId, quantity });
            toast.success(`${quantity} ${quantity === 1 ? "unit" : "units"} of "${product.name}" added to cart!`);
            if (redirectToCart) {
                navigate("/cart");
            }
        } catch (error) {
            toast.error(getErrorMessage(error, "Error adding item to cart."));
        } finally {
            setAdding(false);
            setBuyingNow(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
                <div className="h-4 bg-cream-200 rounded w-1/4"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="h-80 sm:h-96 lg:h-[450px] bg-cream-200 rounded-2xl"></div>
                    <div className="space-y-4">
                        <div className="h-8 bg-cream-200 rounded w-3/4"></div>
                        <div className="h-6 bg-cream-200 rounded w-1/3"></div>
                        <div className="h-24 bg-cream-200 rounded w-full"></div>
                        <div className="h-12 bg-cream-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
                <AlertCircle className="w-16 h-16 text-sand-400 mx-auto" />
                <h1 className="text-2xl font-bold text-ink-900">Product Not Found</h1>
                <p className="text-ink-700 text-sm">
                    The item you are searching for might have been moved or is no longer available in our catalog.
                </p>
                <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 bg-navy-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-navy-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Return to Catalog
                </Link>
            </div>
        );
    }

    const finalPrice = product.discountPercentage > 0
        ? product.price - (product.price * (product.discountPercentage / 100))
        : product.price;

    const isNew = product.createdAt && (new Date().getTime() - new Date(product.createdAt).getTime()) / (1000 * 3600 * 24) <= 30;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
            <SEO title={product.name} description={product.description || `${product.name} in ShelfMart`} />

            {/* Breadcrumb & Navigation */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-ink-700/80 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-navy-800 transition-colors">Home</Link>
                <span>/</span>
                <Link to="/catalog" className="hover:text-navy-800 transition-colors">Catalog</Link>
                <span>/</span>
                <span className="text-ink-900 font-medium">{product.category}</span>
                <span>/</span>
                <span className="text-ink-900/60 truncate max-w-xs">{product.name}</span>
            </nav>

            {/* Product Overview Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                
                {/* Product Image Stage */}
                <div className="bg-white border border-sand-300 rounded-3xl p-6 sm:p-8 flex items-center justify-center relative overflow-hidden shadow-sm group">
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                        <span className="bg-ink-900/80 text-white text-xs uppercase font-bold px-3 py-1 rounded-md backdrop-blur-sm shadow-sm">
                            {product.category}
                        </span>
                        {product.discountPercentage > 0 && (
                            <span className="bg-accent-500 text-white text-xs uppercase font-bold px-3 py-1 rounded-md shadow-sm">
                                -{product.discountPercentage}% OFF
                            </span>
                        )}
                        {isNew && (
                            <span className="bg-white text-navy-800 border border-sand-300 text-xs uppercase font-bold px-3 py-1 rounded-md shadow-sm">
                                New Arrival
                            </span>
                        )}
                    </div>

                    <div className="w-full h-80 sm:h-96 lg:h-[450px] flex items-center justify-center overflow-hidden rounded-2xl bg-cream-100">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="eager"
                            />
                        ) : (
                            <span className="text-ink-700 text-sm font-medium">No image available</span>
                        )}
                    </div>
                </div>

                {/* Product Information & Purchasing */}
                <div className="space-y-6">
                    <div>
                        <div className="text-xs uppercase font-bold tracking-wider text-navy-800 mb-2">
                            {product.category}
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-900 tracking-tight leading-tight">
                            {product.name}
                        </h1>
                    </div>

                    {/* Price Block */}
                    <div className="bg-cream-50 border border-sand-300 rounded-2xl p-4 sm:p-5 flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-extrabold text-navy-800">
                            {formatCurrency(finalPrice)}
                        </span>
                        {product.discountPercentage > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-base sm:text-lg text-ink-700/50 line-through">
                                    {formatCurrency(product.price)}
                                </span>
                                <span className="bg-accent-500/10 text-accent-600 font-bold text-xs px-2.5 py-1 rounded-full">
                                    Save {product.discountPercentage}%
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                        {product.stock > 5 ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                In Stock ({product.stock} units available)
                            </span>
                        ) : product.stock > 0 ? (
                            <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                Low Stock: Only {product.stock} left!
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 text-rose-700 font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                                Sold Out
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-900">Description</h2>
                        <p className="text-ink-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                            {product.description || "Premium quality product carefully tested and cataloged for the ShelfMart marketplace."}
                        </p>
                    </div>

                    {/* Interactive Action Controls */}
                    {product.stock > 0 ? (
                        <div className="space-y-4 pt-4 border-t border-sand-300">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-ink-900">Quantity:</span>
                                <div className="flex items-center border border-sand-300 rounded-xl bg-white overflow-hidden shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1 || adding || buyingNow}
                                        className="p-2.5 hover:bg-cream-200 text-ink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-semibold text-ink-900 text-sm">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock || adding || buyingNow}
                                        className="p-2.5 hover:bg-cream-200 text-ink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-xs text-ink-700 font-medium">
                                    Max {product.stock} per purchase
                                </span>
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => handleAddToCart(false)}
                                    disabled={adding || buyingNow}
                                    className="w-full bg-accent-500 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-accent-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {adding ? "Adding..." : "Add to Cart"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddToCart(true)}
                                    disabled={adding || buyingNow}
                                    className="w-full bg-navy-800 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-navy-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-700 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Check className="w-5 h-5" />
                                    {buyingNow ? "Processing..." : "Buy Now"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-sand-300">
                            <button
                                disabled
                                className="w-full bg-cream-200 text-ink-700/50 py-3.5 rounded-xl font-medium cursor-not-allowed border border-sand-300 text-center"
                            >
                                Currently Out of Stock
                            </button>
                        </div>
                    )}

                    {/* Value Proposition Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-sand-300 text-xs text-ink-700">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-cream-50 border border-sand-300/50">
                            <Truck className="w-4 h-4 text-navy-800 flex-shrink-0" />
                            <span>Fast & secure delivery</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-cream-50 border border-sand-300/50">
                            <ShieldCheck className="w-4 h-4 text-navy-800 flex-shrink-0" />
                            <span>100% Genuine product</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-cream-50 border border-sand-300/50">
                            <RotateCcw className="w-4 h-4 text-navy-800 flex-shrink-0" />
                            <span>30-Day return policy</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Recommendation */}
            {relatedProducts.length > 0 && (
                <section className="space-y-6 pt-8 border-t border-sand-300">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-bold text-ink-900">
                            More in {product.category}
                        </h2>
                        <Link
                            to="/catalog"
                            className="text-sm font-semibold text-navy-800 hover:text-navy-900 transition-colors flex items-center gap-1"
                        >
                            View all <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {relatedProducts.map(rel => {
                            const relFinalPrice = rel.discountPercentage > 0
                                ? rel.price - (rel.price * (rel.discountPercentage / 100))
                                : rel.price;

                            return (
                                <Link
                                    key={rel.productResourceId}
                                    to={`/products/${rel.productResourceId}`}
                                    className="bg-white border border-sand-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group overflow-hidden"
                                >
                                    <div className="h-40 sm:h-48 bg-cream-100 relative overflow-hidden flex items-center justify-center">
                                        {rel.imageUrl ? (
                                            <img
                                                src={rel.imageUrl}
                                                alt={rel.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className="text-ink-700 text-xs font-medium">No image</span>
                                        )}
                                        {rel.discountPercentage > 0 && (
                                            <span className="absolute top-2 right-2 bg-navy-800 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                                                -{rel.discountPercentage}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <h3 className="font-medium text-ink-900 text-sm line-clamp-2 mb-2" title={rel.name}>
                                            {rel.name}
                                        </h3>
                                        <div className="flex items-baseline gap-2 mt-auto">
                                            <span className="text-sm sm:text-base font-bold text-navy-800">
                                                {formatCurrency(relFinalPrice)}
                                            </span>
                                            {rel.discountPercentage > 0 && (
                                                <span className="text-xs text-ink-700/50 line-through">
                                                    {formatCurrency(rel.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}
