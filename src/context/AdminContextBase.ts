import { createContext } from 'react';
import type { Producto } from '../data/productos';
import type { Usuario } from '../data/Usuario';

export interface AdminContextType {
    productos: Producto[];
    loading: boolean;
    error: string | null;
    agregarProducto: (producto: Omit<Producto, 'id'>) => Promise<void>;
    actualizarProducto: (id: number, producto: Partial<Producto>) => Promise<void>;
    eliminarProducto: (id: number) => Promise<void>;
    recargarProductos: () => Promise<void>;
    usuarios: Usuario[];
    agregarUsuario: (usuario: Omit<Usuario, 'id'>) => Promise<void>;
    actualizarUsuario: (id: number, usuario: Partial<Usuario>) => Promise<void>;
    eliminarUsuario: (id: number) => Promise<void>;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);
