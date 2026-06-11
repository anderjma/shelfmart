// Este archivo conforma el panel de control administrativo y resumen global de la tienda.
import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductTable from "../components/ProductTable";
import ProductCard from "../components/ProductCard";
import ProductFormModal from "../components/ProductFormModal";
import SEO from "../components/SEO";

// Este componente centraliza las métricas y los accesos rápidos a las herramientas de gestión interna.
export default function Dashboard() {
    const {
        searchTerm,
        setSearchTerm,
        isModalOpen,
        editingId,
        uploading,
        file,
        setFile,
        formData,
        setFormData,
        previewUrl,
        setPreviewUrl,
        handleOpenModal,
        handleCloseModal,
        handleSubmit,
        handleDelete,
        handleExportCSV,
        filteredProducts
    } = useProducts();

    return (
        <div className="max-w-7xl mx-auto">
            <SEO title="Panel de Control" description="Panel de control administrativo para la gestión de productos, inventario y catálogo." />
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
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o categoría..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full sm:max-w-md border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                />
            </div>

            {/* Tabla para escritorio */}
            <ProductTable 
                products={filteredProducts} 
                onEdit={handleOpenModal} 
                onDelete={handleDelete} 
            />

            {/* Tarjetas para móviles */}
            <div className="block md:hidden space-y-4 px-4 sm:px-0">
                {filteredProducts.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-lg border border-gray-200 text-gray-500">
                        No se encontraron productos.
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <ProductCard 
                            key={product.productResourceId} 
                            product={product} 
                            onEdit={handleOpenModal} 
                            onDelete={handleDelete} 
                        />
                    ))
                )}
            </div>

            {isModalOpen && (
                <ProductFormModal
                    editingId={editingId}
                    formData={formData}
                    setFormData={setFormData}
                    uploading={uploading}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    setFile={setFile}
                    file={file}
                    onSubmit={handleSubmit}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
