import { ContainerFilter } from "../components/productos/containerFilter";
import { FilteredProductsGrid } from "../components/productos/FilteredProductsGrid";
import { useFilters } from "../context/FilterContext";
import { useAdmin } from "../context/useAdmin";

export const PastelesPage = () => {
    const { applyFilters, filters } = useFilters();
    const { productos, loading, error } = useAdmin();
    const filteredProducts = applyFilters(productos);
    const hasActiveFilters = filters.formas.length > 0 || filters.tamanios.length > 0;

    if (loading) return <p className="text-center py-12">Cargando productos...</p>;
    if (error) return <p className="text-center py-12 text-red-600">Error: {error} --Revisar estado de la API</p>;

    return (
        <>
            <h1 className="text-5xl font-semibold text-center mb-12">Pasteles</h1>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <ContainerFilter />
                <FilteredProductsGrid 
                    productos={filteredProducts} 
                    hasActiveFilters={hasActiveFilters} 
                />
            </div>
        </>
    );
};