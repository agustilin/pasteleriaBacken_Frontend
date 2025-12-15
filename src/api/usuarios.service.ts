import { api } from "./client";
import type { AxiosError } from "axios";

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  telefono: number;
  fechaNacimiento: string; 
  direccion: string;
  codigoPromocional?: string;
  esDuocUC: boolean;
  esMayorDe50: boolean;
  tieneDescuentoFelices50: boolean;
  descuentoPorcentaje: number;
  tortaGratisCumpleanosDisponible: boolean;
  tortaGratisCumpleanosUsada: boolean;
  añoTortaGratisCumpleanos?: number;
}

export const fetchUsuarios = async (): Promise<Usuario[]> => {
  console.log('[fetchUsuarios] Llamando a:', api.defaults.baseURL + '/usuarios');
  const { data } = await api.get("/usuarios");
  console.log('[fetchUsuarios] Respuesta recibida:', data);
  
  //respuesta siempre un array de Usuario
  if (Array.isArray(data)) return data as Usuario[];
  if (data && typeof data === "object") {
    type Paginated<T> = { content?: T[]; items?: T[]; data?: T[] };
    const p = data as Paginated<Usuario>;
    if (p.content && Array.isArray(p.content)) return p.content;
    if (p.items && Array.isArray(p.items)) return p.items;
    if (p.data && Array.isArray(p.data)) return p.data;
    // Si llega un único objeto por error, lo envolvemos en array
    return [data as Usuario];
  }
  console.warn("fetchUsuarios: respuesta no reconocida, devolviendo []");
  return [];
};

export const fetchUsuario = async (id: number): Promise<Usuario> => {
  const { data } = await api.get(`/usuarios/${id}`);
  return data;
};

export const fetchUsuarioPorEmail = async (email: string): Promise<Usuario> => {
  const { data } = await api.get(`/usuarios/email/${email}`);
  return data;
};

export const createUsuario = async (usuario: Omit<Usuario, "id">): Promise<Usuario> => {
  const { data } = await api.post("/usuarios", usuario);
  return data;
};

export const updateUsuario = async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
  try {
    // Adaptar tipos al backend: telefono como string, no enviar email si no cambia
    const payload: Record<string, unknown> = { ...usuario } as Record<string, unknown>;
    if (payload.telefono !== undefined && payload.telefono !== null) {
      payload.telefono = String(payload.telefono);
    }
    // Evitar enviar email vacío o undefined
    if (payload.email === undefined) {
      delete payload.email;
    }
    const { data } = await api.put(`/usuarios/${id}`, payload);
    return data;
  } catch (e: unknown) {
    let message = 'Error actualizando usuario';
    const err = e as AxiosError<unknown>;
    const respData = err?.response?.data as { message?: string } | undefined;
    if (respData?.message) {
      message = respData.message;
    } else if (typeof err?.message === 'string') {
      message = err.message;
    }
    throw new Error(message);
  }
};

export const deleteUsuario = async (id: number): Promise<void> => {
  await api.delete(`/usuarios/${id}`);
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data } = await api.get(`/usuarios/check-email/${email}`);
    return data;
  } catch {
    return false;
  }
};

export const login = async (email: string, password: string): Promise<Usuario> => {
  const { data } = await api.post("/usuarios/login", { email, password });
  return data;
};
