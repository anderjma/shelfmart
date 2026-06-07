import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";
import { Flame, Sparkles, Timer } from "lucide-react";

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

    // Filtros reales usando las nuevas columnas
    const offers = products.filter(p => p.discountPercentage > 0).slice(0, 4); 
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).slice(0, 4);
    
    // Filtramos los productos creados en los últimos 7 días
    const newArrivals = products.filter(p => {
        if (!p.createdAt) return false;
        const diffDays = (new Date().getTime() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
    }).slice(0, 4);

    const renderBadges = (product: Product, type: 'offer' | 'new' | 'low') => {
        if (type === 'low') return <span className="bg-amber-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm animate-pulse">¡Solo quedan {product.stock}!</span>;
        if (type === 'offer') return <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">-{product.discountPercentage}% OFF</span>;
        if (type === 'new') return <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">Nuevo</span>;
        return null;
    };

    const ProductCard = ({ product, type }: { product: Product, type: 'offer' | 'new' | 'low' }) => {
        const finalPrice = product.discountPercentage > 0 
            ? product.price - (product.price * (product.discountPercentage / 100)) 
            : product.price;

        return (
            <Link to="/catalogo" className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md block relative">
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10 pointer-events-none">
                    <span className="bg-black/70 text-white text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-sm">
                        {product.category || 'General'}
                    </span>
                    <div className="flex flex-col gap-1 items-end">
                        {renderBadges(product, type)}
                    </div>
                </div>
                
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-400 text-sm font-medium">Sin imagen</span>
                    )}
                </div>
                <div className="p-4 flex-1">
                    <h3 className="font-bold text-gray-900 text-lg truncate" title={product.name}>{product.name}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-blue-600 font-bold text-xl">₡{finalPrice.toFixed(2)}</p>
                        {product.discountPercentage > 0 && <p className="text-xs text-gray-400 line-through">₡{product.price}</p>}
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="space-y-12 pb-12">
            <div className="relative bg-gray-900 h-96 flex items-center justify-center overflow-hidden rounded-xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-lg">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md tracking-tight">Portal Comercial</h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-medium drop-shadow">Encuentra los mejores productos al mejor precio. Calidad y servicio garantizados en cada compra.</p>
                    <Link to="/catalogo" className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg text-lg inline-block">
                        Ver Catálogo Completo
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
                        <Flame className="w-6 h-6 text-orange-500 mr-2" /> Ofertas Especiales
                    </h2>
                    {offers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {offers.map(product => <ProductCard key={`offer-${product.productResourceId}`} product={product} type="offer" />)}
                        </div>
                    ) : <p className="text-gray-500 bg-gray-50 p-6 rounded-lg text-center border border-gray-100">Próximamente nuevas ofertas.</p>}
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
                        <Sparkles className="w-6 h-6 text-emerald-500 mr-2" /> Recién Llegados
                    </h2>
                    {newArrivals.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {newArrivals.map(product => <ProductCard key={`new-${product.productResourceId}`} product={product} type="new" />)}
                        </div>
                    ) : <p className="text-gray-500 bg-gray-50 p-6 rounded-lg text-center border border-gray-100">Próximamente nuevos productos.</p>}
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
                        <Timer className="w-6 h-6 text-red-500 mr-2" /> ¡Últimas Unidades!
                    </h2>
                    {lowStock.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {lowStock.map(product => <ProductCard key={`low-${product.productResourceId}`} product={product} type="low" />)}
                        </div>
                    ) : (
                        <p className="text-gray-500 bg-gray-50 p-6 rounded-lg text-center border border-gray-100">No hay productos con bajo stock en este momento.</p>
                    )}
                </section>
            </div>
        </div>
    );
}
