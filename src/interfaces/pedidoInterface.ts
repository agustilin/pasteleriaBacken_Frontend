import type { CartItem } from "./cartInterface";
import type { Usuario } from "../data/Usuario";

export type PedidoEstado = 'completado' | 'pendiente' | 'cancelado';

export interface PedidoUsuario {
    id?: number;
    email: string;
    nombre?: string;
}

// Item de pedido que puede venir del carrito (frontend) o del backend
export interface PedidoItem {
    id?: number;
    quantity: number;
    price?: number; // usado por backend
    precio?: number; // usado por frontend
    titulo?: string;
    nombre?: string;
    producto?: {
        id?: number;
        nombre?: string;
        titulo?: string;
        precio?: number;
    };
}

export type PedidoLinea = CartItem | PedidoItem;

// Pedido normalizado que usa la app
export interface Pedido {
    id: string;
    fecha: Date;
    items: PedidoLinea[];
    subtotal: number;
    descuentoCodigo: number;
    descuentoUsuario: number;
    total: number;
    codigoPromoAplicado?: string;
    estado: PedidoEstado;
    usuario?: PedidoUsuario;
    userEmail?: string;
}

// Forma en la que vuelve desde la API
export interface PedidoApi {
    id?: number;
    usuario?: Usuario;
    userEmail?: string;
    items?: PedidoItem[];
    fecha?: string | Date;
    subtotal?: number | string;
    descuentoCodigo?: number | string;
    descuentoUsuario?: number | string;
    total?: number | string;
    codigoPromoAplicado?: string;
    estado?: PedidoEstado;
}

export interface PedidosState {
    pedidos: Pedido[];
}

export interface PedidosContextType {
    pedidos: Pedido[];
    agregarPedido: (pedido: Omit<Pedido, 'id' | 'fecha' | 'estado'>) => void;
    obtenerPedidosUsuario: (userEmail: string) => Pedido[];
}
