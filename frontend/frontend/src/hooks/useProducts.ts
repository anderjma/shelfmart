import React, { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import type { Product, ProductFormData } from "../types/product";
import { sanitizeImageUrl } from "../lib/sanitizeImageUrl";
import toast from "react-hot-toast";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
            toast.error("Error al cargar productos");
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
        setPreviewUrl(null);
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
        setPreviewUrl(null);
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

    return {
        products,
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
        loadProducts,
        handleOpenModal,
        handleCloseModal,
        handleSubmit,
        handleDelete,
        handleExportCSV,
        filteredProducts
    };
}
