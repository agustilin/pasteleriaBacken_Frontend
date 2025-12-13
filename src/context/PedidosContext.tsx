import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Pedido, PedidoApi, PedidosContextType } from '../interfaces/pedidoInterface';
import { useUser } from './useUser';
import { listarPedidosUsuario } from '../api/pedidos.service';

const PedidosContext = createContext<PedidosContextType | undefined>(undefined);

export const PedidosProvider = ({ children }: { children: ReactNode }) => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const { user } = useUser();

    const loadPedidosDesdeAPI = useCallback(async (email: string) => {
        try {
            const pedidosAPI = await listarPedidosUsuario(email);
            const pedidosFormateados: Pedido[] = (pedidosAPI as PedidoApi[]).map((p) => {
                const fechaPedido = p.fecha ? new Date(p.fecha) : new Date();
                const usuarioEmail = p.usuario?.email || p.userEmail || email;

                return {
                    id: p.id?.toString() || `${email}-${Date.now()}`,
                    items: p.items || [],
                    fecha: fechaPedido,
                    subtotal: Number(p.subtotal ?? 0),
                    descuentoCodigo: Number(p.descuentoCodigo ?? 0),
                    descuentoUsuario: Number(p.descuentoUsuario ?? 0),
                    total: Number(p.total ?? 0),
                    codigoPromoAplicado: p.codigoPromoAplicado || undefined,
                    estado: p.estado || 'completado',
                    usuario: p.usuario
                        ? {
                            id: p.usuario.id,
                            email: p.usuario.email,
                            nombre: p.usuario.nombre,
                        }
                        : undefined,
                    userEmail: usuarioEmail,
                };
            });
            setPedidos(pedidosFormateados);
        } catch (error) {
            console.error('Error cargando pedidos desde API:', error);
            loadPedidosDesdeLocalStorage();
        }
    }, []);

    // Cargar pedidos desde API cuando el usuario está disponible
    useEffect(() => {
        if (user && user.email) {
            loadPedidosDesdeAPI(user.email);
        }
    }, [user, loadPedidosDesdeAPI]);

    const loadPedidosDesdeLocalStorage = () => {
        const savedPedidos = localStorage.getItem('pedidos');
        if (savedPedidos) {
            try {
                const parsedPedidos = JSON.parse(savedPedidos);
                const pedidosConFechas = parsedPedidos.map((p: any) => ({
                    ...p,
                    fecha: new Date(p.fecha),
                    userEmail: p.userEmail || (typeof p.id === 'string' ? p.id.split('-')[0] : undefined)
                }));
                setPedidos(pedidosConFechas);
            } catch {
                localStorage.removeItem('pedidos');
            }
        }
    };

    const agregarPedido = (pedidoData: Omit<Pedido, 'id' | 'fecha' | 'estado'>) => {
        if (!user) {
            return; // Silenciosamente no hacer nada si no hay usuario
        }

        const nuevoPedido: Pedido = {
            ...pedidoData,
            id: `${user.email}-${Date.now()}`,
            fecha: new Date(),
            estado: 'completado',
            userEmail: user.email,
            usuario: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
            },
        };

        setPedidos(prev => [nuevoPedido, ...prev]);
    };

    const obtenerPedidosUsuario = (userEmail: string): Pedido[] => {
        return pedidos.filter(pedido => {
            const pedidoEmail = pedido.usuario?.email || pedido.userEmail || '';
            return pedidoEmail === userEmail;
        });
    };

    return (
        <PedidosContext.Provider
            value={{
                pedidos,
                agregarPedido,
                obtenerPedidosUsuario
            }}
        >
            {children}
        </PedidosContext.Provider>
    );
};

export const usePedidos = () => {
    const context = useContext(PedidosContext);
    if (!context) {
        throw new Error('usePedidos must be used within a PedidosProvider');
    }
    return context;
};
