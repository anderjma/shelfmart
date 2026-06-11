// Este archivo define la página de inicio principal visible para cualquier visitante del sitio web.
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";
import SEO from "../components/SEO";

// Este componente presenta la propuesta de valor y las llamadas a la acción principales de la tienda.
export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error cargando productos", error);
            }
        };
        fetchProducts();
    }, []);

    const offers = products.filter(p => p.discountPercentage > 0).slice(0, 4); 
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).slice(0, 4);
    
    const newArrivals = products.filter(p => {
        if (!p.createdAt) return false;
        const diffDays = (new Date().getTime() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
    }).slice(0, 4);

    return (
        <div className="space-y-12 sm:space-y-16 pb-12 sm:pb-16 bg-slate-50">
            <SEO title="Inicio" description="Bienvenido a la plataforma comercial avanzada para la gestión de inventario y ventas en tiempo real." />
            {/* Sección hero */}
            <div className="bg-slate-900 mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 rounded-lg overflow-hidden shadow-sm relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="relative z-10 px-6 py-12 sm:py-16 md:py-20 text-center max-w-3xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                        Plataforma Comercial Avanzada
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300 mb-6 font-normal leading-relaxed">
                        Sistema de gestión de inventario y compras con sincronización en tiempo real.
                    </p>
                    <Link to="/catalogo" className="inline-block bg-blue-600 text-white px-5 sm:px-6 py-2.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        Ver Catálogo Completo
                    </Link>
                </div>
            </div>

            {/* Listado de productos */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {offers.length > 0 && (
                    <section>
                        <SectionHeader title="Ofertas Destacadas" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                            {offers.map(product => <ProductCard key={`offer-${product.productResourceId}`} product={product} type="offer" />)}
                        </div>
                    </section>
                )}

                {newArrivals.length > 0 && (
                    <section>
                        <SectionHeader title="Nuevos Ingresos" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                            {newArrivals.map(product => <ProductCard key={`new-${product.productResourceId}`} product={product} type="new" />)}
                        </div>
                    </section>
                )}

                {lowStock.length > 0 && (
                    <section>
                        <SectionHeader title="Inventario Limitado" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                            {lowStock.map(product => <ProductCard key={`low-${product.productResourceId}`} product={product} type="low" />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

const renderBadges = (product: Product, type: 'offer' | 'new' | 'low') => {
    if (type === 'low') return <span className="bg-slate-800 text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm">Pocas uds</span>;
    if (type === 'offer') return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-sm">-{product.discountPercentage}%</span>;
    if (type === 'new') return <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-sm border border-slate-200">Nuevo</span>;
    return null;
};

const ProductCard = ({ product, type }: { product: Product, type: 'offer' | 'new' | 'low' }) => {
    const finalPrice = product.discountPercentage > 0 
        ? product.price - (product.price * (product.discountPercentage / 100)) 
        : product.price;

    return (
        <Link to="/catalogo" className="bg-white border border-slate-200/60 rounded-md shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full group">
            <div className="relative h-40 sm:h-48 bg-slate-50 flex items-center justify-center overflow-hidden rounded-t-md">
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                    <span className="bg-white/90 text-slate-600 text-[9px] uppercase font-medium px-1.5 py-0.5 rounded shadow-sm">
                        {product.category || 'General'}
                    </span>
                    <div className="flex flex-col gap-1 items-end">
                        {renderBadges(product, type)}
                    </div>
                </div>
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200" loading="lazy" />
                ) : (
                    <span className="text-slate-300 text-xs font-medium">Sin imagen</span>
                )}
            </div>
            
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white rounded-b-md">
                <h3 className="font-medium text-slate-800 text-sm sm:text-base line-clamp-2 leading-snug mb-3" title={product.name}>{product.name}</h3>
                <div className="flex items-center gap-2 mt-auto flex-wrap">
                    <p className="text-blue-600 font-semibold text-sm sm:text-base">₡{finalPrice.toFixed(2)}</p>
                    {product.discountPercentage > 0 && <p className="text-xs text-slate-400 line-through">₡{product.price}</p>}
                </div>
            </div>
        </Link>
    );
};

const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800">{title}</h2>
    </div>
);
