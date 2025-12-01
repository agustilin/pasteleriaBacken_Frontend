import { api } from "./client";
import type { Producto } from "../data/productos";

export const fetchProductos = async (): Promise<Producto[]> => {
    const { data } = await api.get("/productos");
    // Normalizar respuesta a siempre un array de Producto
    if (Array.isArray(data)) return data as Producto[];
    if (data && typeof data === "object") {
        type Paginated<T> = { content?: T[]; items?: T[]; data?: T[] };
        const p = data as Paginated<Producto>;
        if (p.content && Array.isArray(p.content)) return p.content;
        if (p.items && Array.isArray(p.items)) return p.items;
        if (p.data && Array.isArray(p.data)) return p.data;
        // Si llega un único objeto por error, lo envolvemos en array
        return [data as Producto];
    }
    console.warn("fetchProductos: respuesta no reconocida, devolviendo []");
    return [];
};

export const fetchProducto = async (id: number): Promise<Producto> => {
    const { data } = await api.get(`/productos/${id}`);
    return data;
};

export const createProducto = async (p: Omit<Producto, "id">): Promise<Producto> => {
    const { data } = await api.post("/productos", p);
    return data;
};

export const updateProducto = async (id: number, p: Partial<Producto>): Promise<Producto> => {
    const { data } = await api.put(`/productos/${id}`, p);
    return data;
};

export const deleteProducto = async (id: number): Promise<void> => {
    await api.delete(`/productos/${id}`);
};