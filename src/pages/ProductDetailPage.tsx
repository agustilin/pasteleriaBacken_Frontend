import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Producto } from "../data/productos";
import { fetchProducto } from "../api/productos.service";
import { ProductImage } from "../components/product/ProductImage";
import { ProductInfo } from "../components/product/ProductInfo";
import { ProductActions } from "../components/product/ProductActions";
import { ProductNotFound } from "../components/product/ProductNotFound";
import { HiArrowLeft } from "react-icons/hi";

export const ProductDetailPage = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const data = await fetchProducto(Number(id));
                setProducto(data);
            } catch (e: unknown) {
                const message = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Producto no encontrado';
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <p className="text-center py-12">Cargando producto...</p>;
    if (error) return <ProductNotFound />;

    if (!producto) {
        return <ProductNotFound />;
    }

    return (
        <div className=" py-8 px-4">
            <Link 
                to="/pasteles"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
            >
                <HiArrowLeft size={20} />
                Volver a pasteles
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                <div className="bg-rose-200 p-6 rounded-2xl">
                    <ProductImage 
                        imagen={producto.imagen} 
                    />
                </div>

                <div className="bg-rose-200 p-6 rounded-2xl">
                    <ProductInfo producto={producto} />
                    <ProductActions producto={producto} />
                </div>
            </div>
        </div>
    );
};
