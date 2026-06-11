// Este archivo conforma el panel de control administrativo y resumen global de la tienda.
import React, { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import type { Product, ProductFormData } from "../types/product";
import { sanitizeImageUrl } from "../lib/sanitizeImageUrl";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Este componente centraliza las métricas y los accesos rápidos a las herramientas de gestión interna.
export default function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        category: "General",
        stock: 0,
        price: 0,
        imageUrl: "",
        discountPercentage: 0
    });

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error al cargar productos", error);
        }
    };

    useEffect(() => {
        let active = true;
        getProducts()
            .then(data => {
                if (active) setProducts(data);
            })
            .catch(error => {
                console.error("Error al cargar productos", error);
            });
        return () => {
            active = false;
        };
    }, []);

    const handleOpenModal = (product?: Product) => {
        setFile(null);
        if (product) {
            setEditingId(product.productResourceId);
            setFormData({ 
                name: product.name, 
                category: product.category || "General",
                stock: product.stock, 
                price: product.price, 
                imageUrl: product.imageUrl || "",
                discountPercentage: product.discountPercentage || 0
            });
        } else {
            setEditingId(null);
            setFormData({ name: "", category: "General", stock: 0, price: 0, imageUrl: "", discountPercentage: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        
        try {
            let currentImageUrl = formData.imageUrl;

            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

                // Upload directo a la API REST de Supabase Storage (evita bug de hostname del SDK)
                const uploadRes = await fetch(
                    sanitizeImageUrl(`${supabaseUrl}/storage/v1/object/product-images/${fileName}`),
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${supabaseKey}`,
                            'apikey': supabaseKey,
                            'x-upsert': 'false',
                        },
                        body: file,
                    }
                );

                if (!uploadRes.ok) {
                    const err = await uploadRes.json().catch(() => ({ message: uploadRes.statusText }));
                    toast.error("Error al subir imagen: " + (err.message ?? uploadRes.statusText));
                    setUploading(false);
                    return;
                }

                // URL pública construida manualmente
                currentImageUrl = sanitizeImageUrl(`${supabaseUrl}/storage/v1/object/public/product-images/${fileName}`);
            }

            const dataToSave = { ...formData, imageUrl: currentImageUrl };

            if (editingId) {
                await updateProduct(editingId, dataToSave);
                toast.success("Producto actualizado");
            } else {
                await createProduct(dataToSave);
                toast.success("Producto creado");
            }
            
            handleCloseModal();
            loadProducts();
        } catch (error) {
            console.error("Error al guardar", error);
            toast.error("Error al guardar el producto");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Está seguro de eliminar este producto?")) {
            try {
                await deleteProduct(id);
                loadProducts();
                toast.success("Producto eliminado");
            } catch {
                toast.error("Error al eliminar");
            }
        }
    };

    const handleExportCSV = () => {
        const headers = ["Nombre", "Categoría", "Stock", "Precio (CRC)", "Descuento (%)"];
        const rows = products.map(p => [
            `"${p.name.replace(/"/g, '""')}"`,
            `"${p.category || 'General'}"`,
            p.stock,
            p.price,
            p.discountPercentage || 0
        ]);
        
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "reporte_comercial.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="px-4 sm:px-0 flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Panel de Control</h2>
                <div className="flex flex-wrap gap-2">
                    <Link to="/admin/audit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm flex items-center font-medium text-sm">📊 Auditoría</Link>
                    <Link to="/admin/orders" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 shadow-sm flex items-center font-medium text-sm">📦 Ver Órdenes</Link>
                    <button onClick={handleExportCSV} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm flex items-center font-medium text-sm">Exportar CSV</button>
                    <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm font-medium text-sm">+ Nuevo Producto</button>
                </div>
            </div>

            <div className="px-4 sm:px-0 mb-4">
                <input type="text" placeholder="Buscar por nombre o categoría..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:max-w-md border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
            </div>

            {/* Tabla para escritorio */}
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
                        {filteredProducts.map((product) => (
                            <tr key={product.productResourceId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover rounded border border-gray-200" />
                                    ) : (
                                        <div className="h-10 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"><span className="text-gray-400 text-xs">N/A</span></div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">{product.category || 'General'}</span></td>
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
                                    <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-900">Editar</button>
                                    <button onClick={() => handleDelete(product.productResourceId)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tarjetas para móviles */}
            <div className="block md:hidden space-y-4 px-4 sm:px-0">
                {filteredProducts.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-lg border border-gray-200 text-gray-500">No se encontraron productos.</div>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.productResourceId} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3 flex flex-col">
                            <div className="flex gap-4 items-center">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="h-16 w-16 object-cover rounded border border-gray-200 flex-shrink-0" />
                                ) : (
                                    <div className="h-16 w-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center flex-shrink-0"><span className="text-gray-400 text-xs">N/A</span></div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{product.name}</h4>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] font-medium">{product.category || 'General'}</span>
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
                                <button onClick={() => handleOpenModal(product)} className="text-sm font-semibold text-blue-600 hover:text-blue-800 py-1 px-2 hover:bg-blue-50 rounded">Editar</button>
                                <button onClick={() => handleDelete(product.productResourceId)} className="text-sm font-semibold text-red-600 hover:text-red-800 py-1 px-2 hover:bg-red-50 rounded">Eliminar</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingId ? "Editar Producto" : "Nuevo Producto"}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                        <input type="text" required placeholder="Ej. Electrónica" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Descuento (%)</label>
                                        <input type="number" min="0" max="100" value={formData.discountPercentage} onChange={e => setFormData({...formData, discountPercentage: e.target.value ? parseFloat(e.target.value) : 0})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                                        <input type="number" required min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value ? parseInt(e.target.value) : 0})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Precio Base</label>
                                        <input type="number" required min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value ? parseFloat(e.target.value) : 0})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Imagen</label>
                                    <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={handleCloseModal} disabled={uploading} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                                <button type="submit" disabled={uploading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                    {uploading ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
