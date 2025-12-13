import { api } from "./client";
import type { PedidoApi } from "../interfaces/pedidoInterface";

export interface PedidoItemRequest {
  productoId: number;
  cantidad: number;
}

export interface CrearPedidoRequest {
  userEmail: string;
  items: PedidoItemRequest[];
  subtotal: number;
  descuentoCodigo: number;
  descuentoUsuario: number;
  total: number;
  codigoPromoAplicado?: string;
}

export const crearPedido = async (payload: CrearPedidoRequest) => {
  const { data } = await api.post("/pedidos", payload);
  return data;
};

export const listarPedidosUsuario = async (email: string) => {
  const { data } = await api.get(`/pedidos/usuario/${email}`);
  return data as PedidoApi[];
};

export const listarPedidos = async () => {
  const { data } = await api.get(`/pedidos`);
  return data as PedidoApi[];
};
