import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { Producto } from "../../data/productos";
import { formatPrice } from "../../utils/formatters";
import { useCart } from "../../context/useCart";

interface Props {
    producto : Producto
}


export const CardProduct = ({producto}:Props) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Evita que el Link se active
        addToCart(producto);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000); 
    };

    return(
        <div className="bg-rose-200 flex flex-col gap-6 relative p-3 rounded-2xl">
            {/* Imagen clickeable */}
            <Link to={`/pasteles/${producto.id}`} className="flex relative">
                <div className="flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]">
                <img
                    src={producto.imagen}
                    alt={producto.titulo}
                    className="object-contain h-full w-full"
                />
                </div>
            </Link>

            {/* Nombre y precio */}
            <div className="flex flex-col gap-1 items-center">
                <p className="text-[17spx] font-bold">{producto.titulo}</p>
                <p className="text-[15px] font-medium">{formatPrice(producto.precio)}</p>
            </div>

            {/* Botón de añadir siempre visible */}
            <button
                onClick={handleAddToCart}
                className={`${
                added
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-black border-slate-200"
                } border w-full py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium 
                                    hover:bg-stone-100 transition-all duration-300`}
            >
                <FiPlus />
                {added ? "¡Añadido!" : "Añadir"}
            </button>

            {/* Etiqueta de agotado */}
            {producto.stock === 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                Agotado
                </span>
            )}
        </div>
    )
}