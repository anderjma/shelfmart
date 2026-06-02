import React, { useState, useEffect } from "react";
import { getDashboardStats, getAuditLogs } from "../services/auditService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

export default function AuditDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [statsData, logsData] = await Promise.all([
            getDashboardStats(),
            getAuditLogs()
        ]);
        setStats(statsData);
        setLogs(logsData);
    };

    if (!stats) return <div className="p-12 text-center text-gray-500 font-medium">Cargando métricas...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Auditoría y Analíticas</h2>
                <Link to="/admin/dashboard" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium">
                    Volver al Inventario
                </Link>
            </div>

            {/* Tarjetas Superiores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Ingresos Totales</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₡{stats.revenue.toLocaleString('es-CR')}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Órdenes Completadas</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-red-500">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Alertas de Stock (≤ 5)</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{stats.lowStock} productos</p>
                </div>
            </div>

            {/* Gráfico de Tendencias */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Tendencia de Ventas (Últimos 5 días)</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.salesChart}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `₡${value/1000}k`} />
                            <Tooltip 
                                cursor={{ fill: '#F3F4F6' }}
                                formatter={(value: number) => [`₡${value.toLocaleString('es-CR')}`, 'Ingresos']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="total" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bitácora de Acciones */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Bitácora de Movimientos</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Acción Realizada</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(log.timestamp).toLocaleString('es-CR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    @{log.user}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {log.action}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

