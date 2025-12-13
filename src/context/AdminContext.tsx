import { useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../data/productos'; 
import { fetchProductos, createProducto, updateProducto, deleteProducto } from '../api/productos.service';
import type { Usuario } from '../data/Usuario';
import { fetchUsuarios, createUsuario, updateUsuario as updateUsuarioAPI, deleteUsuario } from '../api/usuarios.service';
import { listarPedidosUsuario, listarPedidos } from '../api/pedidos.service';
import { AdminContext } from './AdminContextBase';
import { useNotification } from './NotificationContext';

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { showNotification } = useNotification();

  // Función para cargar productos
    const loadProductos = async () => {
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

  // Cargar desde API al montar
    useEffect(() => {
    loadProductos();
    }, []);

    // Estado de usuarios - cargar desde API
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    // Cargar usuarios desde API al iniciar
    useEffect(() => {
        const loadUsuarios = async () => {
            try {
                const data = await fetchUsuarios();
                setUsuarios(data);
            } catch (e: unknown) {
                console.error('Error cargando usuarios:', e);
                // No bloqueamos la app si hay error en usuarios
            }
        };
        loadUsuarios();
    }, []);

    // Funciones CRUD para usuarios
    const agregarUsuario = async (nuevo: Omit<Usuario, 'id'>) => {
        const creado = await createUsuario(nuevo);
        setUsuarios(prev => [...prev, creado]);
    };

    const actualizarUsuario = async (id: number, usuarioActualizado: Partial<Usuario>) => {
        const actualizado = await updateUsuarioAPI(id, usuarioActualizado);
        setUsuarios(prev => prev.map(u => u.id === id ? actualizado : u));
    };

    const eliminarUsuario = async (id: number) => {
        // Bloquear eliminación si el usuario tiene pedidos
        const usuario = usuarios.find(u => u.id === id);
        if (usuario?.email) {
            try {
                const pedidos = await listarPedidosUsuario(usuario.email);
                if (pedidos.length > 0) {
                    showNotification({
                        type: 'warning',
                        title: 'Acción bloqueada',
                        message: 'No se puede eliminar al usuario porque tiene pedidos registrados.',
                    });
                    return;
                }
            } catch (e) {
                console.error('Error verificando pedidos del usuario:', e);
                showNotification({
                    type: 'error',
                    title: 'No se pudo verificar',
                    message: 'No se pudo verificar si el usuario tiene pedidos. Intenta nuevamente.',
                });
                return;
            }
        }

        await deleteUsuario(id);
        setUsuarios(prev => prev.filter(u => u.id !== id));
    };

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
        // Verificar si el producto está en algún pedido
        try {
            const todosLosPedidos = await listarPedidos();
            const productosEnUso = new Set<number>();
            
            todosLosPedidos.forEach((pedido: any) => {
                if (pedido.items && Array.isArray(pedido.items)) {
                    pedido.items.forEach((item: any) => {
                        const productoId = item.productoId || item.producto?.id || item.id;
                        if (productoId) {
                            productosEnUso.add(Number(productoId));
                        }
                    });
                }
            });

            if (productosEnUso.has(id)) {
                showNotification({
                    type: 'warning',
                    title: 'No se puede eliminar',
                    message: 'Este producto está asociado a uno o más pedidos y no puede ser eliminado.',
                });
                return;
            }
        } catch (e) {
            console.error('Error verificando pedidos con este producto:', e);
            showNotification({
                type: 'error',
                title: 'Error al verificar',
                message: 'No se pudo verificar si el producto está en uso. Intenta nuevamente.',
            });
            return;
        }

        await deleteProducto(id);
        setProductos(prev => prev.filter(p => p.id !== id));
    };

    const recargarProductos = async () => {
        await loadProductos();
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
                recargarProductos,
                usuarios,
                agregarUsuario,
                actualizarUsuario,
                eliminarUsuario,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};
