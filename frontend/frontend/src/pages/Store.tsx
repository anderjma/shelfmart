// Este archivo renderiza el escaparate virtual donde los clientes pueden explorar el catálogo de artículos.
import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import type { PaginatedProducts } from "../services/productService";
import { addToCart } from "../services/orderService";
import type { Product } from "../types/product";
import toast from "react-hot-toast";
import { ShoppingCart, Search, ChevronLeft, ChevronRight } from "lucide-react";
import SEO from "../components/SEO";

// Este componente exhibe los productos en un grid filtrable por categoría e incluye la acción de agregar al carrito.
export default function Store() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const pageSize = 8;

    // Debounce del término de búsqueda para evitar solicitudes excesivas
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Cargar categorías una sola vez al montar el componente
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getProducts();
                if (Array.isArray(data)) {
                    const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category || "General")));
                    setCategories(["Todas", ...uniqueCategories]);
                }
            } catch {
                toast.error("Error al cargar categorías.");
            }
        };
        fetchCategories();
    }, []);

    // Cargar productos de forma paginada y filtrada
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Pequeño retraso para dar suavidad visual al esqueleto
                await new Promise(resolve => setTimeout(resolve, 400));
                
                const data = (await getProducts({
                    page: currentPage,
                    pageSize: pageSize,
                    search: debouncedSearchTerm,
                    category: selectedCategory === "Todas" ? undefined : selectedCategory
                })) as unknown as PaginatedProducts | Product[];

                if (data && typeof data === "object" && "items" in data) {
                    setProducts(data.items);
                    setTotalPages(data.totalPages);
                    setTotalCount(data.totalCount);
                } else if (Array.isArray(data)) {
                    // Fallback para backends antiguos o no actualizados: filtrar en cliente
                    const filtered = data.filter(p => {
                        const matchesCategory = selectedCategory === "Todas" || (p.category || "General") === selectedCategory;
                        const matchesSearch = p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                                             (p.category && p.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
                        return matchesCategory && matchesSearch;
                    });
                    setProducts(filtered);
                    setTotalPages(1);
                    setTotalCount(filtered.length);
                }
            } catch {
                toast.error("Error al cargar productos.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, selectedCategory, debouncedSearchTerm]);

    const handleAddToCart = async (productId: string) => {
        try {
            await addToCart({ productId, quantity: 1 });
            toast.success("Producto agregado al carrito");
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || "Debes iniciar sesión para comprar.");
        }
    };

    const renderBadges = (product: Product) => {
        const isNew = product.createdAt && (new Date().getTime() - new Date(product.createdAt).getTime()) / (1000 * 3600 * 24) <= 7;

        if (product.stock === 0) return <span className="bg-gray-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">Agotado</span>;
        if (product.stock > 0 && product.stock <= 5) return <span className="bg-amber-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm animate-pulse">¡Solo quedan {product.stock}!</span>;
        if (product.discountPercentage > 0) return <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">-{product.discountPercentage}% OFF</span>;
        if (isNew) return <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">Nuevo</span>;
        return null;
    };

    // Este componente representa el esqueleto visual durante la carga de datos.
    const ProductSkeleton = () => (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden flex flex-col animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="mt-auto h-10 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <SEO title="Catálogo de Productos" description="Explore nuestro catálogo completo de productos con control de stock y ofertas especiales en tiempo real." />
            <div className="text-center space-y-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
                <p className="text-gray-500">Explora nuestra selección y encuentra lo que necesitas.</p>
            </div>

            {/* Filtros ocultos durante la carga */}
            {!loading && (
                <div className="space-y-6">
                    <div className="max-w-md mx-auto relative">
                        <input
                            type="text"
                            placeholder="Buscar productos por nombre o categoría..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {categories.map((cat, index) => (
                            <button
                                key={index}
                                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    selectedCategory === cat ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                }`}
                                aria-pressed={selectedCategory === cat}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" aria-busy="true" aria-label="Cargando catálogo de productos">
                    {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center p-16 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No hay productos disponibles</h3>
                    <p className="text-gray-500 mt-1">Intenta seleccionando otra categoría.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => {
                            const finalPrice = product.discountPercentage > 0 
                                ? product.price - (product.price * (product.discountPercentage / 100)) 
                                : product.price;

                            return (
                                <div key={product.productResourceId} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md relative group">
                                    <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10 pointer-events-none">
                                        <span className="bg-black/70 text-white text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-sm">
                                            {product.category || 'General'}
                                        </span>
                                        <div className="flex flex-col gap-1 items-end">
                                            {renderBadges(product)}
                                        </div>
                                    </div>

                                    <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                                        ) : (
                                            <span className="text-gray-400 text-sm font-medium">Sin imagen</span>
                                        )}
                                    </div>
                                    
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1" title={product.name}>{product.name}</h3>
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <p className="text-2xl font-bold text-blue-600">₡{finalPrice.toFixed(2)}</p>
                                            {product.discountPercentage > 0 && <p className="text-sm text-gray-400 line-through">₡{product.price}</p>}
                                        </div>
                                        
                                        <div className="mt-auto">
                                            {product.stock > 0 ? (
                                                <button 
                                                    onClick={() => handleAddToCart(product.productResourceId)} 
                                                    className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                                                    aria-label={`Añadir ${product.name} al carrito`}
                                                >
                                                    <ShoppingCart className="w-4 h-4" /> Añadir al Carrito
                                                </button>
                                            ) : (
                                                <button disabled className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-md font-medium cursor-not-allowed border border-gray-200">
                                                    Agotado
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Controles de Paginación */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Siguiente
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Mostrando del <span className="font-semibold">{((currentPage - 1) * pageSize) + 1}</span> al{" "}
                                        <span className="font-semibold">
                                            {Math.min(currentPage * pageSize, totalCount)}
                                        </span>{" "}
                                        de <span className="font-semibold">{totalCount}</span> resultados
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="sr-only">Anterior</span>
                                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                                            <button
                                                key={pNum}
                                                onClick={() => setCurrentPage(pNum)}
                                                aria-current={pNum === currentPage ? "page" : undefined}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
                                                    pNum === currentPage
                                                        ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                                } transition-colors`}
                                            >
                                                {pNum}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="sr-only">Siguiente</span>
                                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
