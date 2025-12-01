import { useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../data/productos'; 
import { fetchProductos, createProducto, updateProducto, deleteProducto } from '../api/productos.service';
import type { Usuario } from '../data/Usuario';
import { AdminContext } from './AdminContextBase';

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

  // Cargar desde API
    useEffect(() => {
    const load = async () => {
        setLoading(true);
        setError(null);
        try {
        const data = await fetchProductos();
        setProductos(data);
        } catch (e: unknown) {
        let message = 'Error cargando productos';
        if (e instanceof Error && e.message) {
            message = e.message;
        } else if (typeof e === 'object' && e !== null && 'response' in e) {
            const resp = (e as { response?: { data?: { message?: string } } }).response;
            message = resp?.data?.message ?? message;
        }
        setError(message);
        } finally {
        setLoading(false);
        }
    };
    load();
    }, []);

    // Estado de usuarios
    const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
        const savedUsuarios = localStorage.getItem('usuariosRegistrados');
        if (savedUsuarios) {
            try {
                return JSON.parse(savedUsuarios);
            } catch {
                return [];
            }
        }
        return [];
    });

    // Guardar productos en localStorage cuando cambien
    //useEffect(() => {
       // localStorage.setItem('productos', JSON.stringify(productos));
    //}, [productos]);

    
    // Guardar usuarios en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
    }, [usuarios]);

    // Funciones CRUD para productos
    const agregarProducto = async (nuevo: Omit<Producto, 'id'>) => {
        const creado = await createProducto(nuevo);
        setProductos(prev => [...prev, creado]);
    };

    const actualizarProducto = async (id: number, parcial: Partial<Producto>) => {
        const actualizado = await updateProducto(id, parcial);
        setProductos(prev => prev.map(p => p.id === id ? actualizado : p));
    };

    const eliminarProducto = async (id: number) => {
        await deleteProducto(id);
        setProductos(prev => prev.filter(p => p.id !== id));
    };

    // Funciones CRUD para usuarios
    const actualizarUsuario = (email: string, usuarioActualizado: Partial<Usuario>) => {
        setUsuarios(usuarios.map(u => 
            u.email === email ? { ...u, ...usuarioActualizado } : u
        ));
    };

    const eliminarUsuario = (email: string) => {
        setUsuarios(usuarios.filter(u => u.email !== email));
    };

    return (
        <AdminContext.Provider
            value={{
                productos,
                loading,
                error,
                agregarProducto,
                actualizarProducto,
                eliminarProducto,
                usuarios,
                actualizarUsuario,
                eliminarUsuario,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};
