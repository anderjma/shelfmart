import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { addToCart } from "../services/orderService";
import type { Product } from "../types/product";
import toast from "react-hot-toast";

export default function Store() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                
                // Extraer categorías únicas dinámicamente
                const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category || "General")));
                setCategories(["Todas", ...uniqueCategories]);
            } catch (error) {
                console.error("Error al cargar el catálogo", error);
                toast.error("Error al cargar productos.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = async (productId: string) => {
        try {
            await addToCart({ productId, quantity: 1 });
            toast.success("Producto agregado al carrito");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Debes iniciar sesión como cliente para comprar.");
        }
    };

    const filteredProducts = selectedCategory === "Todas" 
        ? products 
        : products.filter(p => (p.category || "General") === selectedCategory);

    if (loading) return <div className="text-center p-12 text-gray-500 font-medium">Cargando catálogo...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="text-center space-y-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
                <p className="text-gray-500">Explora nuestra selección y encuentra lo que necesitas.</p>
            </div>

            {/* Menú de Filtros por Categoría (Pills) */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === cat
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Cuadrícula de Productos */}
            {filteredProducts.length === 0 ? (
                <div className="text-center p-12 bg-white border border-gray-200 rounded-lg text-gray-500">
                    No hay productos disponibles en esta categoría.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.productResourceId} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
                            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                                    {product.category || 'General'}
                                </span>
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400">Sin imagen</span>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                                <p className="text-2xl font-bold text-blue-600 mb-4">₡{product.price}</p>
                                
                                <div className="mt-auto">
                                    {product.stock > 0 ? (
                                        <button 
                                            onClick={() => handleAddToCart(product.productResourceId)}
                                            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            Añadir al Carrito
                                        </button>
                                    ) : (
                                        <button disabled className="w-full bg-gray-200 text-gray-500 py-2 rounded-md font-medium cursor-not-allowed">
                                            Agotado
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
