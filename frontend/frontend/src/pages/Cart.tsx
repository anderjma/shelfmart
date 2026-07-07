// Este archivo maneja la vista del carrito de compras y el flujo de confirmación de pedidos.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, checkout, updateCartItemQuantity, removeFromCart } from "../services/orderService";
import toast from "react-hot-toast";
import type { Cart as CartType } from "../types/order";
import { Trash2, Plus, Minus } from "lucide-react";
import SEO from "../components/SEO";

// Este componente lista los artículos seleccionados, calcula totales e inicia el proceso de checkout.
export default function Cart() {
    const [cart, setCart] = useState<CartType | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await getCart();
                setCart(data);
            } catch {
                setError("Error al cargar el carrito.");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (productId: string, currentQty: number, change: number) => {
        const newQty = currentQty + change;
        if (newQty < 1) {
            handleRemoveItem(productId);
            return;
        }

        try {
            const updatedCart = await updateCartItemQuantity(productId, newQty);
            setCart(updatedCart);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || "Error al actualizar la cantidad.");
        }
    };

    const handleRemoveItem = async (productId: string) => {
        if (!window.confirm("¿Desea eliminar este producto del carrito?")) return;

        try {
            const updatedCart = await removeFromCart(productId);
            setCart(updatedCart);
            toast.success("Producto eliminado del carrito");
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || "Error al eliminar el producto.");
        }
    };

    const handleCheckout = async () => {
        if (!window.confirm("¿Desea confirmar su compra?")) return;
        
        setProcessing(true);
        try {
            await checkout();
            toast.success("¡Compra procesada con éxito!");
            navigate("/");
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || "Error al procesar la compra.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="text-center p-8">Cargando carrito...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="text-center py-16 mx-4 sm:mx-0 bg-white rounded-lg shadow-sm border border-gray-200">
                <SEO title="Mi Carrito" description="Su carrito de compras está vacío." />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Su carrito está vacío</h2>
                <button onClick={() => navigate("/")} className="text-blue-600 font-medium hover:text-blue-800 underline">
                    Volver al catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <SEO title="Mi Carrito" description="Consulte sus productos seleccionados y complete su compra de forma segura." />
            <div className="px-4 sm:px-0">
                <h2 className="text-2xl font-bold text-gray-900">Mi Carrito de Compras</h2>
            </div>
            
            {/* Tabla para escritorio */}
            <div className="hidden sm:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cart.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡{item.unitPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                                                className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                                title="Reducir cantidad"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="font-semibold text-gray-800 w-8 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                                                className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                                title="Aumentar cantidad"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">₡{item.subTotal}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleRemoveItem(item.productId)}
                                            className="text-red-600 hover:text-red-950 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                            title="Eliminar producto"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tarjetas para móviles */}
            <div className="block sm:hidden space-y-4 px-4 sm:px-0">
                {cart.items.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3">
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-gray-900 text-base leading-tight">{item.productName}</h3>
                            <span className="text-base font-bold text-gray-900 whitespace-nowrap">₡{item.subTotal}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Precio: ₡{item.unitPrice}</span>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
                                    <button 
                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                                        className="p-0.5 text-gray-500 hover:text-gray-700"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="font-semibold text-gray-800 text-xs w-6 text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                                        className="p-0.5 text-gray-500 hover:text-gray-700"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <button 
                                    onClick={() => handleRemoveItem(item.productId)}
                                    className="text-red-600 hover:text-red-950 p-1 rounded hover:bg-red-50"
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Resumen del carrito */}
            <div className="bg-white px-4 sm:px-6 py-5 sm:rounded-lg sm:shadow-sm sm:border sm:border-gray-200 border-y border-gray-200 sm:border-y-0">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="w-full sm:w-auto flex justify-between items-center sm:block">
                        <span className="text-gray-600 font-medium sm:hidden">Total a pagar:</span>
                        <span className="text-xl font-bold text-gray-900">
                            <span className="hidden sm:inline">Total: </span>
                            ₡{cart.totalAmount}
                        </span>
                    </div>
                    <button 
                        onClick={handleCheckout} 
                        disabled={processing}
                        className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-green-400 transition-colors text-center shadow-sm"
                    >
                        {processing ? "Procesando..." : "Finalizar Compra"}
                    </button>
                </div>
            </div>
        </div>
    );
}

