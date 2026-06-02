import React, { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import type { Product, ProductFormData } from "../types/product";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        stock: 0,
        price: 0,
        imageUrl: ""
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
        loadProducts();
    }, []);

    const handleOpenModal = (product?: Product) => {
        setFile(null);
        if (product) {
            setEditingId(product.productResourceId);
            setFormData({ name: product.name, stock: product.stock, price: product.price, imageUrl: product.imageUrl || "" });
        } else {
            setEditingId(null);
            setFormData({ name: "", stock: 0, price: 0, imageUrl: "" });
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
                
                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, file);

                if (uploadError) {
                    toast.error("Error al subir la imagen a Supabase: " + uploadError.message);
                    setUploading(false);
                    return;
                }

                const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
                currentImageUrl = data.publicUrl;
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
            } catch (error) {
                console.error("Error al eliminar", error);
                toast.error("Error al eliminar");
            }
        }
    };

    const handleExportCSV = () => {
        const headers = ["Nombre", "Stock", "Precio (CRC)"];
        const rows = products.map(p => [
            `"${p.name.replace(/"/g, '""')}"`,
            p.stock,
            p.price
        ]);
        
        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "inventario_pyme.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock <= 5).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return (
        <div>
            <div className="px-4 sm:px-0 flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Panel de Control</h2>
                <div className="flex space-x-3">
                    <button onClick={handleExportCSV} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow-sm flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Exportar CSV
                    </button>
                    <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-sm">
                        + Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="px-4 sm:px-0 mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total de Productos</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalProducts}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Stock Crítico (≤ 5)</dt>
                        <dd className="mt-1 text-3xl font-semibold text-red-600">{lowStockCount}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Valor del Inventario</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">₡{totalValue.toLocaleString('es-CR')}</dd>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-0 mb-4">
                <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:max-w-md border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
            </div>

            <div className="bg-white shadow-sm overflow-hidden sm:rounded-md border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.productResourceId} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover rounded border border-gray-200" />
                                    ) : (
                                        <div className="h-10 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"><span className="text-gray-400 text-xs">N/A</span></div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡{product.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                    <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-900">Editar</button>
                                    <button onClick={() => handleDelete(product.productResourceId)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingId ? "Editar Producto" : "Nuevo Producto"}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                                        <input type="number" required min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value ? parseInt(e.target.value) : 0})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                                        <input type="number" required min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value ? parseFloat(e.target.value) : 0})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Imagen del Producto (Opcional)</label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                                    />
                                    {formData.imageUrl && !file && (
                                        <div className="mt-2 flex items-center space-x-4">
                                            <p className="text-xs text-gray-500">Imagen actual:</p>
                                            <img src={formData.imageUrl} alt="Preview" className="h-16 w-16 object-cover rounded border" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={handleCloseModal} disabled={uploading} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100">Cancelar</button>
                                <button type="submit" disabled={uploading} className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400">
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
