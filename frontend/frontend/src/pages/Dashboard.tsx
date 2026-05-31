import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout, getCurrentUser } from "../services/authService";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import type { Product, ProductFormData } from "../types/product";

export default function Dashboard() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const user = getCurrentUser();
    const isAdmin = user?.role === "Admin";

    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        stock: 0,
        price: 0
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

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingId(product.productResourceId);
            setFormData({ name: product.name, stock: product.stock, price: product.price });
        } else {
            setEditingId(null);
            setFormData({ name: "", stock: 0, price: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateProduct(editingId, formData);
            } else {
                await createProduct(formData);
            }
            handleCloseModal();
            loadProducts();
        } catch (error) {
            console.error("Error al guardar el producto", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Está seguro de eliminar este producto?")) {
            try {
                await deleteProduct(id);
                loadProducts();
            } catch (error) {
                console.error("Error al eliminar", error);
            }
        }
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-xl font-bold text-gray-800">Inventario Pyme</h1>
                            <div className="space-x-4">
                                <Link to="/" className="font-semibold text-blue-600">Productos</Link>
                                {isAdmin && <Link to="/users" className="text-gray-600 hover:text-gray-900">Usuarios</Link>}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-600">Hola, {user?.name}</span>
                            <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-800">Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Productos</h2>
                    <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Nuevo Producto</button>
                </div>

                <div className="px-4 sm:px-0 mb-4">
                    <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:max-w-md border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No se encontraron productos.</td></tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.productResourceId}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡{product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => handleOpenModal(product)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                                            <button onClick={() => handleDelete(product.productResourceId)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingId ? "Editar Producto" : "Nuevo Producto"}</h3>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700">Nombre</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Stock</label><input type="number" required min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Precio</label><input type="number" required min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={handleCloseModal} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">Cancelar</button>
                                <button type="submit" className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
