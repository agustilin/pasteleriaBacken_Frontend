import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Producto } from '../data/productos';

// Tipos de filtros disponibles
export interface Filters {
    formas: string[];
    tamanios: string[];
}

// Tipo del contexto
interface FilterContextType {
    filters: Filters;
    toggleForma: (forma: string) => void;
    toggleTamanio: (tamanio: string) => void;
    clearFilters: () => void;
    applyFilters: (productos: Producto[]) => Producto[];
}

// Estado inicial de filtros
const initialFilters: Filters = {
    formas: [],
    tamanios: [],
};

// Crear el contexto
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider de filtros
export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [filters, setFilters] = useState<Filters>(initialFilters);

    // Toggle forma (agregar/quitar)
    const toggleForma = (forma: string) => {
        setFilters(prev => ({
            ...prev,
            formas: prev.formas.includes(forma)
                ? prev.formas.filter(f => f !== forma)
                : [...prev.formas, forma]
        }));
    };

    // Toggle tamaño 
    const toggleTamanio = (tamanio: string) => {
        setFilters(prev => ({
            ...prev,
            tamanios: prev.tamanios.includes(tamanio)
                ? prev.tamanios.filter(t => t !== tamanio)
                : [...prev.tamanios, tamanio]
        }));
    };

    // Limpiar todos los filtros
    const clearFilters = () => {
        setFilters(initialFilters);
    };

    // Aplicar filtros a un array de productos
    const applyFilters = (productos: Producto[]): Producto[] => {
        // Validación defensiva: asegurar que productos sea un array
        if (!Array.isArray(productos)) {
            return [];
        }
        
        let filtered = productos;

        // Filtrar por forma
        if (filters.formas.length > 0) {
            filtered = filtered.filter(p => filters.formas.includes(p.forma));
        }

        // Filtrar por tamaño
        if (filters.tamanios.length > 0) {
            filtered = filtered.filter(p => filters.tamanios.includes(p.tamanio));
        }

        return filtered;
    };

    return (
        <FilterContext.Provider
            value={{
                filters,
                toggleForma,
                toggleTamanio,
                clearFilters,
                applyFilters,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};

// Hook personalizado para usar los filtros
export const useFilters = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context;
};
