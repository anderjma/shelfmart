import React from "react";
import type { ProductFormData } from "../types/product";

interface ProductFormModalProps {
    editingId: string | null;
    formData: ProductFormData;
    setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
    uploading: boolean;
    previewUrl: string | null;
    setPreviewUrl: (url: string | null) => void;
    setFile: (file: File | null) => void;
    file: File | null;
    onSubmit: (e: React.FormEvent) => Promise<void> | void;
    onClose: () => void;
}

export default function ProductFormModal({
    editingId,
    formData,
    setFormData,
    uploading,
    previewUrl,
    setPreviewUrl,
    setFile,
    file,
    onSubmit,
    onClose
}: ProductFormModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
                <form onSubmit={onSubmit}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {editingId ? "Editar Producto" : "Nuevo Producto"}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.name} 
                                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Ej. Electrónica" 
                                    value={formData.category} 
                                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descuento (%)</label>
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    value={formData.discountPercentage} 
                                    onChange={e => setFormData({ ...formData, discountPercentage: e.target.value ? parseFloat(e.target.value) : 0 })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock</label>
                                <input 
                                    type="number" 
                                    required 
                                    min="0" 
                                    value={formData.stock} 
                                    onChange={e => setFormData({ ...formData, stock: e.target.value ? parseInt(e.target.value) : 0 })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Precio Base</label>
                                <input 
                                    type="number" 
                                    required 
                                    min="0" 
                                    step="0.01" 
                                    value={formData.price} 
                                    onChange={e => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : 0 })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Imagen</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                    const selectedFile = e.target.files ? e.target.files[0] : null;
                                    setFile(selectedFile);
                                    if (selectedFile) {
                                        setPreviewUrl(URL.createObjectURL(selectedFile));
                                    } else {
                                        setPreviewUrl(null);
                                    }
                                }} 
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                            />
                            
                            {(previewUrl || formData.imageUrl) && (
                                <div className="mt-3 flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <img 
                                        src={previewUrl || formData.imageUrl} 
                                        alt="Previsualización" 
                                        className="w-16 h-16 object-cover rounded-md border border-gray-200 shadow-sm"
                                    />
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Vista Previa</span>
                                        <span className="text-xs text-gray-400 block truncate max-w-[200px]">
                                            {file ? file.name : "Imagen actual del producto"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={uploading} 
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={uploading} 
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            {uploading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
