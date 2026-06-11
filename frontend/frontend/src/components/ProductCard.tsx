import React from "react";
import type { Product } from "../types/product";

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3 flex flex-col">
            <div className="flex gap-4 items-center">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-16 w-16 object-cover rounded border border-gray-200 flex-shrink-0" />
                ) : (
                    <div className="h-16 w-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-xs">N/A</span>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{product.name}</h4>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] font-medium">
                            {product.category || 'General'}
                        </span>
                        {product.discountPercentage > 0 && (
                            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold">-{product.discountPercentage}% OFF</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-100 pt-3">
                <div>
                    <span className="text-gray-400 block">Stock Disponible</span>
                    <span className="font-semibold text-gray-800">{product.stock} uds.</span>
                </div>
                <div>
                    <span className="text-gray-400 block">Precio Unitario</span>
                    <span className="font-semibold text-blue-600">₡{product.price}</span>
                </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-3 mt-auto">
                <button onClick={() => onEdit(product)} className="text-sm font-semibold text-blue-600 hover:text-blue-800 py-1 px-2 hover:bg-blue-50 rounded">Editar</button>
                <button onClick={() => onDelete(product.productResourceId)} className="text-sm font-semibold text-red-600 hover:text-red-800 py-1 px-2 hover:bg-red-50 rounded">Eliminar</button>
            </div>
        </div>
    );
}
