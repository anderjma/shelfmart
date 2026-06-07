import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Sparkles, Timer } from "lucide-react";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [lowStock, setLowStock] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                setLowStock(data.filter((p: Product) => p.stock > 0 && p.stock <= 5));
            } catch (error) {
                console.error("Error cargando productos", error);
            }
        };
        fetchProducts();
    }, []);

    // Separamos algunos productos para la sección de Ofertas y Nuevos
    const offers = products.slice(0, 4); 
    const newArrivals = products.slice(-4).reverse();

    const ProductCard = ({ product }: { product: Product }) => (
        <Link to="/catalogo" className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md block">
            <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.category || 'General'}
                </span>
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400">Sin imagen</span>
                )}
            </div>
            <div className="p-4 flex-1">
                <h3 className="font-bold text-gray-900 text-lg truncate">{product.name}</h3>
                <p className="text-blue-600 font-bold text-xl mt-1">₡{product.price}</p>
            </div>
        </Link>
    );

    return (
        <div className="space-y-12 pb-12">
            {/* Bloque de Bienvenida */}
            <div className="relative bg-gray-900 h-96 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 shadow-sm">Bienvenido al Portal Comercial</h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">Encuentra los mejores productos al mejor precio. Calidad y servicio garantizados en cada compra.</p>
                    <Link to="/catalogo" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg text-lg">
                        Ver Catálogo Completo
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* Carrusel: Ofertas */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2"><Flame className="w-6 h-6 text-orange-500 inline-block mr-2" /> Ofertas Especiales</h2>
                    {offers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {offers.map(product => <ProductCard key={`offer-${product.productResourceId}`} product={product} />)}
                        </div>
                    ) : <p className="text-gray-500">Próximamente nuevas ofertas.</p>}
                </section>

                {/* Carrusel: Nuevos Productos */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2"><Sparkles className="w-6 h-6 text-yellow-500 inline-block mr-2" /> Recién Llegados</h2>
                    {newArrivals.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {newArrivals.map(product => <ProductCard key={`new-${product.productResourceId}`} product={product} />)}
                        </div>
                    ) : <p className="text-gray-500">Próximamente nuevos productos.</p>}
                </section>

                {/* Carrusel: Últimas Unidades */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2"><Timer className="w-6 h-6 text-red-500 inline-block mr-2" /> ¡Últimas Unidades!</h2>
                    {lowStock.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {lowStock.slice(0, 4).map(product => (
                                <div key={product.productResourceId} className="bg-white border border-red-200 rounded-lg shadow-sm overflow-hidden flex flex-col relative">
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10 animate-pulse">
                                        Quedan {product.stock}
                                    </div>
                                    <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400">Sin imagen</span>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg truncate">{product.name}</h3>
                                        <p className="text-blue-600 font-bold text-xl mt-1">₡{product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay productos con bajo stock en este momento.</p>
                    )}
                </section>
            </div>
        </div>
    );
}


