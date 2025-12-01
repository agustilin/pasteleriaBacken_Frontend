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
    usuarios: Usuario[];
    actualizarUsuario: (email: string, usuario: Partial<Usuario>) => void;
    eliminarUsuario: (email: string) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);
