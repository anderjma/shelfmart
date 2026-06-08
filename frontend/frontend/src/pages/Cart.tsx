import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, checkout } from "../services/orderService";
import toast from "react-hot-toast";
import type { Cart as CartType } from "../types/order";

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
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Su carrito está vacío</h2>
                <button onClick={() => navigate("/")} className="text-blue-600 font-medium hover:text-blue-800 underline">
                    Volver al catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Mi Carrito de Compras</h2>
            
            {/* Vista Dual: Tarjetas en móvil, Tabla en pantallas sm y superiores */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                {/* Tabla para Escritorio */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cart.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡{item.unitPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">₡{item.subTotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tarjetas para Móviles */}
                <div className="block sm:hidden divide-y divide-gray-100">
                    {cart.items.map((item, index) => (
                        <div key={index} className="p-4 space-y-2">
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-900 text-sm">{item.productName}</span>
                                <span className="text-sm font-bold text-blue-600">₡{item.subTotal}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Precio Unitario: ₡{item.unitPrice}</span>
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">{item.quantity} u.</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resumen del Carrito responsivo */}
                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total: ₡{cart.totalAmount}</span>
                    <button 
                        onClick={handleCheckout} 
                        disabled={processing}
                        className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 disabled:bg-green-400 transition-colors text-center"
                    >
                        {processing ? "Procesando..." : "Finalizar Compra"}
                    </button>
                </div>
            </div>
        </div>
    );
}

