// This file defines the main home page visible to any visitor of the website.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../features/store/api/productService";
import type { Product } from "../../features/store/types";
import SEO from "../components/SEO";
import { formatCurrency } from "../utils/formatCurrency";
import { useLanguage } from "../../lib/i18n-context";
import { translateProduct } from "../../lib/translations";

// This component presents the value proposition and the store's main calls to action.
export default function Home() {
    const { t, language } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error loading products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const ProductSkeleton = () => (
        <div className="bg-white border border-sand-300 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
            <div className="h-40 sm:h-48 bg-cream-200 rounded-t-2xl"></div>
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white rounded-b-2xl">
                <div className="h-4 sm:h-5 bg-cream-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 sm:h-5 bg-cream-200 rounded w-1/2 mb-3"></div>
                <div className="mt-auto h-5 sm:h-6 bg-cream-200 rounded w-1/3"></div>
            </div>
        </div>
    );

    // Sort products by creation date descending so newly registered items are prioritized
    const sortedByNewest = [...products].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
    });

    const offers = sortedByNewest.filter(p => p.discountPercentage > 0).slice(0, 4);
    const lowStock = sortedByNewest.filter(p => p.stock > 0 && p.stock <= 5).slice(0, 4);

    const recentArrivals = sortedByNewest.filter(p => {
        if (!p.createdAt) return false;
        const diffDays = (new Date().getTime() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24);
        return diffDays <= 30;
    });
    const newArrivals = (recentArrivals.length >= 4 ? recentArrivals : sortedByNewest).slice(0, 4);

    return (
        <div className="space-y-12 sm:space-y-16 pb-12 sm:pb-16 bg-cream-100">
            <SEO title={t("home.heroTitle", "Welcome to ShelfMart!")} description={t("home.heroSubtitle", "Thoughtfully sourced pieces for a home that feels considered, not decorated.")} />
            {/* Hero section */}
            <div className="bg-slate-950 mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 rounded-2xl overflow-hidden shadow-sm relative">
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]"></div>
                <div className="relative z-10 px-6 py-14 sm:py-20 md:py-24 text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight text-balance drop-shadow-sm">
                        {t("home.heroTitle", "Welcome to ShelfMart!")}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-200 mb-7 max-w-lg mx-auto drop-shadow-sm">
                        {t("home.heroSubtitle", "Thoughtfully sourced pieces for a home that feels considered, not decorated.")}
                    </p>
                    <Link to="/catalog" className="inline-block bg-accent-500 hover:bg-accent-600 text-white px-6 sm:px-7 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                        {t("home.exploreCatalog", "Explore our catalog")}
                    </Link>
                </div>
            </div>

            {/* Product listing */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {loading ? (
                    <>
                        <section>
                            <SectionHeader title={t("home.featuredDeals", "Featured Deals")} />
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                                {[...Array(4)].map((_, i) => <ProductSkeleton key={`skel-offer-${i}`} />)}
                            </div>
                        </section>
                        <section>
                            <SectionHeader title={t("home.newArrivals", "New Arrivals")} />
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                                {[...Array(4)].map((_, i) => <ProductSkeleton key={`skel-new-${i}`} />)}
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        {offers.length > 0 && (
                            <section>
                                <SectionHeader title={t("home.featuredDeals", "Featured Deals")} />
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                                    {offers.map(product => <ProductCard key={`offer-${product.productResourceId}`} product={product} type="offer" t={t} language={language} />)}
                                </div>
                            </section>
                        )}

                        {newArrivals.length > 0 && (
                            <section>
                                <SectionHeader title={t("home.newArrivals", "New Arrivals")} />
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                                    {newArrivals.map(product => <ProductCard key={`new-${product.productResourceId}`} product={product} type="new" t={t} language={language} />)}
                                </div>
                            </section>
                        )}

                        {lowStock.length > 0 && (
                            <section>
                                <SectionHeader title={t("home.limitedStock", "Limited Stock")} />
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                                    {lowStock.map(product => <ProductCard key={`low-${product.productResourceId}`} product={product} type="low" t={t} language={language} />)}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

const renderBadges = (product: Product, type: 'offer' | 'new' | 'low', t: (k: string, f?: string) => string) => {
    return (
        <>
            {type === 'new' && <span className="bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold px-2 py-0.5 rounded-md shadow-xs">{t("store.new", "New")}</span>}
            {(type === 'offer' || product.discountPercentage > 0) && (
                <span className="bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-xs">-{product.discountPercentage}%</span>
            )}
            {type === 'low' && <span className="bg-amber-600 text-white text-xs uppercase font-semibold px-2 py-0.5 rounded-md shadow-xs">{t("home.lowStockBadge", "Low stock")}</span>}
        </>
    );
};

const ProductCard = ({ product, type, t, language }: { product: Product, type: 'offer' | 'new' | 'low', t: (k: string, f?: string) => string, language: "es" | "en" }) => {
    const p = translateProduct(product, language);
    const finalPrice = product.discountPercentage > 0
        ? product.price - (product.price * (product.discountPercentage / 100))
        : product.price;

    return (
        <Link to={`/products/${product.productResourceId}`} className="bg-white border border-sand-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full group">
            <div className="relative h-40 sm:h-48 bg-cream-100 flex items-center justify-center overflow-hidden rounded-t-2xl">
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10 pointer-events-none">
                    <span className="bg-slate-900/85 dark:bg-slate-800/90 text-white text-xs uppercase font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs">
                        {t(`cat.${product.category}`, product.category || 'Featured')}
                    </span>
                    <div className="flex flex-col gap-1 items-end">
                        {renderBadges(product, type, t)}
                    </div>
                </div>
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";
                        }}
                    />
                ) : (
                    <span className="text-ink-700 text-xs font-medium">{t("product.noImage", "No image")}</span>
                )}
            </div>

            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white rounded-b-2xl">
                <h3 className="font-medium text-ink-900 text-sm sm:text-base line-clamp-2 leading-snug mb-3" title={p.name}>{p.name}</h3>
                <div className="flex items-center gap-2 mt-auto flex-wrap">
                    <p className="text-accent-500 font-bold text-sm sm:text-base">{formatCurrency(finalPrice)}</p>
                    {product.discountPercentage > 0 && <p className="text-xs text-ink-700/60 line-through">{formatCurrency(product.price)}</p>}
                </div>
            </div>
        </Link>
    );
};

const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between border-b border-sand-300 pb-3 mb-6">
        <h2 className="text-lg sm:xl font-semibold text-ink-900">{title}</h2>
    </div>
);
