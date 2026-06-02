import React, { useState, useEffect } from "react";
import { getAllOrders } from "../services/orderService";
import { Link } from "react-router-dom";

export default function OrdersManager() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error al cargar órdenes:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-12 text-gray-600 font-medium">Cargando órdenes...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Módulo de Despachos</h2>
                <Link to="/dashboard" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium">
                    Volver al Inventario
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-lg">Aún no hay compras procesadas.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Cliente: {order.customerUsername}</h3>
                                    <span className="text-xs font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full mt-2 inline-block border border-green-200">
                                        Pago Completado
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total de la Orden</p>
                                    <p className="text-2xl font-bold text-blue-600">₡{order.totalAmount}</p>
                                </div>
                            </div>
                            <div className="px-6 py-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Productos a Despachar:</h4>
                                <ul className="divide-y divide-gray-100">
                                    {order.items.map((item: any, i: number) => (
                                        <li key={i} className="py-3 flex justify-between items-center text-sm">
                                            <span className="text-gray-900 font-medium flex items-center">
                                                <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded mr-3">{item.quantity}x</span> 
                                                {item.productName}
                                            </span>
                                            <span className="text-gray-500 font-medium">₡{item.unitPrice} c/u</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
