import { useState } from "react";
import { HiMinus, HiPlus, HiShoppingCart } from "react-icons/hi";
import { Link } from "react-router-dom";
import type { Producto } from "../../data/productos"; //localStorage
import { useCart } from "../../context/useCart";

interface ProductActionsProps {
    producto: Producto;
}

export const ProductActions = ({ producto }: ProductActionsProps) => {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        // Agregar al carrito la cantidad seleccionada
        for (let i = 0; i < quantity; i++) {
            addToCart(producto);
        }
        
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            setQuantity(1); // Reset cantidad
        }, 2000);
    };

    const isOutOfStock = producto.stock !== undefined && producto.stock === 0;
    const maxQuantity = producto.stock !== undefined ? producto.stock : 999;

    return (
        <div className="space-y-6 border-t border-slate-200 pt-6">
            
            {/* Selector de cantidad */}
            <div className="space-y-3">
                <label className="block font-semibold text-sm text-gray-700">
                    Cantidad
                </label>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 border border-slate-300 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isOutOfStock}
                    >
                        <HiMinus size={20} />
                    </button>
                    
                    <span className="w-16 text-center font-semibold text-lg">
                        {quantity}
                    </span>
                    
                    <button
                        onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                        className="p-2 border border-slate-300 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isOutOfStock || quantity >= maxQuantity}
                    >
                        <HiPlus size={20} />
                    </button>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-medium transition-colors ${
                        added 
                            ? 'bg-green-500 text-white' 
                            : isOutOfStock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-rose-500 text-white hover:bg-rose-600'
                    }`}
                >
                    <HiShoppingCart size={22} />
                    {added ? '¡Añadido al carrito!' : isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
                </button>

                <Link
                    to="/cart"
                    className="sm:w-auto px-6 py-4 border-2 border-rose-500 rounded-lg font-medium hover:bg-rose-600 transition-colors text-center"
                >
                    Ver carrito
                </Link>
            </div>
        </div>
    );
};
