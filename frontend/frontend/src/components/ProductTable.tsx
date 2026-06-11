import React from "react";
import type { Product } from "../types/product";

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
    return (
        <div className="hidden md:block bg-white shadow-sm overflow-hidden sm:rounded-md border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oferta</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.productResourceId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover rounded border border-gray-200" />
                                ) : (
                                    <div className="h-10 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400 text-xs">N/A</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                    {product.category || 'General'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡{product.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.discountPercentage > 0 ? (
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">-{product.discountPercentage}%</span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-900">Editar</button>
                                <button onClick={() => onDelete(product.productResourceId)} className="text-red-600 hover:text-red-900">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
