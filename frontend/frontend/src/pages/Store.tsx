import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicProducts } from "../services/catalogService";
import { addToCart } from "../services/orderService";
import { getCurrentUser } from "../services/authService";
import toast from "react-hot-toast";

export default function Store() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = getCurrentUser();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getPublicProducts();
            console.log("Productos cargados desde el backend:", data); // Diagnóstico
            setProducts(data);
        } catch (err: any) {
            setError("Error al cargar el catálogo.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId: string) => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (user.role !== "Customer") {
            toast.error("Su cuenta administrativa no puede comprar.");
            return;
        }

        console.log("Intentando enviar este ID de producto al carrito:", productId); // Diagnóstico

        try {
            await addToCart({ productId, quantity: 1 });
            toast.success("¡Agregado al carrito!");
        } catch (err: any) {
            console.error("Detalle completo del rechazo del servidor:", err.response?.data);
            
            // Atrapar errores automáticos de validación de ASP.NET
            if (err.response?.data?.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat().join(" | ");
                toast.error(`Dato inválido: ${validationErrors}`);
            } else {
                toast.error(err.response?.data?.message || "Error al agregar al carrito");
            }
        }
    };

    if (loading) return <div className="text-center p-8 text-gray-600">Cargando el catálogo...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Catálogo de Productos</h2>
            
            {products.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">No hay productos disponibles en este momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product: any, index: number) => {
                        // Intentamos adivinar cómo viene el ID desde su CatalogController
                        const id = product.productResourceId || product.productId || product.id;
                        
                        return (
                            <div key={id || index} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 flex flex-col">
                                <div className="h-48 bg-gray-100 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400 text-sm font-medium">Sin imagen</span>
                                    )}
                                </div>
                                
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                                    <p className="text-2xl font-bold text-blue-600 mt-2">₡{product.price}</p>
                                    <p className="text-sm text-gray-500 mt-1">Disponibles: {product.stock}</p>
                                    
                                    <div className="mt-auto pt-4">
                                        <button
                                            onClick={() => handleAddToCart(id)}
                                            disabled={product.stock <= 0}
                                            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                                                product.stock > 0 
                                                ? "bg-blue-600 hover:bg-blue-700" 
                                                : "bg-gray-300 cursor-not-allowed"
                                            }`}
                                        >
                                            {product.stock > 0 ? "Agregar al Carrito" : "Agotado"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

