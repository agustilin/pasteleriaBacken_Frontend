import { useState } from 'react';
import { useAdmin } from '../../../context/useAdmin';
import { ProductItem } from './ProductItem';
import { ProductForm } from './ProductForm';
import type { Producto } from '../../../data/productos';

export const ProductList = () => {
    const { productos, agregarProducto, actualizarProducto, eliminarProducto, loading, error } = useAdmin();
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Producto | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterForma, setFilterForma] = useState<string>('todas');
    const [filterTamanio, setFilterTamanio] = useState<string>('todos');
    if (loading) return <p className="p-4">Cargando productos...</p>;
    if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

    // Asegurar que productos sea un array
    const sourceProductos: Producto[] = Array.isArray(productos) ? productos : [];
    // Filtrar productos
    const productosFiltrados = sourceProductos.filter((producto: Producto) => {
        const matchesSearch = producto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesForma = filterForma === 'todas' || producto.forma === filterForma;
        const matchesTamanio = filterTamanio === 'todos' || producto.tamanio === filterTamanio;
        
        return matchesSearch && matchesForma && matchesTamanio;
    });

    const handleAddProduct = () => {
        setEditingProduct(undefined);
        setShowForm(true);
    };

    const handleEditProduct = (producto: Producto) => {
        setEditingProduct(producto);
        setShowForm(true);
    };

    const handleSubmit = (producto: Omit<Producto, 'id'> | Producto) => {
        if ('id' in producto) {
            // Actualizar producto existente
            actualizarProducto(producto.id, producto);
        } else {
            // Agregar nuevo producto
            agregarProducto(producto);
        }
        setShowForm(false);
        setEditingProduct(undefined);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProduct(undefined);
    };

    return (
        <div>
            {/* Header con búsqueda y filtros */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Gestión de Productos</h2>
                    <button
                        onClick={handleAddProduct}
                        className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
                    >
                        + Agregar Producto
                    </button>
                </div>

                {/* Barra de búsqueda */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                </div>

                {/* Filtros */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Forma
                        </label>
                        <select
                            value={filterForma}
                            onChange={(e) => setFilterForma(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        >
                            <option value="todas">Todas</option>
                            <option value="Circulares">Circulares</option>
                            <option value="Cuadrada">Cuadrada</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tamaño
                        </label>
                        <select
                            value={filterTamanio}
                            onChange={(e) => setFilterTamanio(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        >
                            <option value="todos">Todos</option>
                            <option value="Grande">Grande</option>
                            <option value="Pequenia">Pequeña</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Productos</p>
                    <p className="text-2xl font-bold text-blue-600">{sourceProductos.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">En Stock</p>
                    <p className="text-2xl font-bold text-green-600">
                        {sourceProductos.filter((p: Producto) => (p.stock || 0) > 0).length}
                    </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Sin Stock</p>
                    <p className="text-2xl font-bold text-red-600">
                        {sourceProductos.filter((p: Producto) => (p.stock || 0) === 0).length}
                    </p>
                </div>
            </div>

            {/* Lista de productos */}
            <div className="space-y-4">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto: Producto) => (
                        <ProductItem
                            key={producto.id}
                            producto={producto}
                            onEdit={handleEditProduct}
                            onDelete={eliminarProducto}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No se encontraron productos</p>
                    </div>
                )}
            </div>

            {/* Formulario modal */}
            {showForm && (
                <ProductForm
                    producto={editingProduct}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};
