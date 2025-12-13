import { HiShoppingBag, HiCalendar, HiCheck } from "react-icons/hi";
import { formatPrice } from "../../utils/formatters";
import type { Pedido } from "../../interfaces/pedidoInterface";

interface PedidoItemProps {
    pedido: Pedido;
}

export const PedidoItem = ({ pedido }: PedidoItemProps) => {
    const formatFecha = (fecha: Date) => {
        return new Date(fecha).toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                        <HiShoppingBag className="text-rose-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Pedido #{pedido.id.slice(-8)}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <HiCalendar size={16} />
                            {formatFecha(pedido.fecha)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <HiCheck size={16} />
                    {pedido.estado}
                </div>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-medium text-sm text-gray-700 mb-3">Productos ({pedido.items.length})</h4>
                <div className="space-y-2 mb-4">
                    {pedido.items.map((item, index) => {
                        const anyItem = item as any;
                        const cantidad = Number(anyItem.quantity ?? 0);
                        const titulo = anyItem.titulo
                            ?? anyItem.nombre
                            ?? anyItem.producto?.nombre
                            ?? anyItem.producto?.titulo
                            ?? 'Producto';
                        const precioUnitario = Number(anyItem.precio ?? anyItem.price ?? anyItem.producto?.precio ?? 0);

                        return (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    {cantidad}x {titulo}
                                </span>
                                <span className="font-medium">{formatPrice(precioUnitario * cantidad)}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>{formatPrice(pedido.subtotal)}</span>
                    </div>
                    
                    {pedido.descuentoCodigo > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Descuento código {pedido.codigoPromoAplicado && `(${pedido.codigoPromoAplicado})`}</span>
                            <span>-{formatPrice(pedido.descuentoCodigo)}</span>
                        </div>
                    )}
                    
                    {pedido.descuentoUsuario > 0 && (
                        <div className="flex justify-between text-sm text-rose-600">
                            <span>Descuento usuario</span>
                            <span>-{formatPrice(pedido.descuentoUsuario)}</span>
                        </div>
                    )}

                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                        <span>Total pagado</span>
                        <span className="text-rose-600">{formatPrice(pedido.total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
