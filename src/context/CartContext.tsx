import { useReducer, useEffect, type ReactNode } from 'react';
import type { CartState, CartAction } from '../interfaces/cartInterface';
import type { Producto } from '../data/productos';
import { CartContext } from './CartContextBase';

// Códigos promocionales válidos
const VALID_PROMO_CODES: Record<string, number> = {
    'PROMO10': 10,
    'PROMO20': 20,
    'DESCUENTO15': 15,
    'BIENVENIDO': 5,
    'FELICES50': 10, // Código especial del aniversario
};

// Estado inicial del carrito
const initialState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
    promoCode: null,
    subtotal: 0,
    discount: 0,
};

// Funciones para cálculos
const calculateSubtotal = (items: CartState['items']): number => {
    return items.reduce((sum, item) => sum + item.precio * item.quantity, 0);
};

const calculateTotal = (subtotal: number, discount: number): number => {
    return subtotal - discount;
};

const calculateDiscount = (subtotal: number, promoCode: CartState['promoCode']): number => {
    if (!promoCode || !promoCode.isValid) return 0;
    return Math.round(subtotal * (promoCode.discount / 100));
};

const calculateItemCount = (items: CartState['items']): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingItemIndex = state.items.findIndex(
                item => item.id === action.payload.id
            );

            let newItems;
            if (existingItemIndex > -1) {
                // Si el producto ya existe, verificar stock antes de incrementar
                const currentItem = state.items[existingItemIndex];
                const stockDisponible = action.payload.stock ?? 0;
                
                // No permitir agregar más si ya alcanzamos el stock
                if (currentItem.quantity >= stockDisponible) {
                    console.warn(`No se puede agregar más de ${stockDisponible} unidades de ${action.payload.titulo}`);
                    return state; // No modificar el estado
                }
                
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Si es nuevo, verificar que haya stock disponible
                const stockDisponible = action.payload.stock ?? 0;
                if (stockDisponible < 1) {
                    console.warn(`Producto ${action.payload.titulo} sin stock disponible`);
                    return state; // No agregar si no hay stock
                }
                
                newItems = [...state.items, { ...action.payload, quantity: 1 }];
            }

            const subtotal = calculateSubtotal(newItems);
            const discount = calculateDiscount(subtotal, state.promoCode);
            const total = calculateTotal(subtotal, discount);

            return {
                ...state,
                items: newItems,
                subtotal,
                discount,
                total,
                itemCount: calculateItemCount(newItems),
            };
        }

        case 'REMOVE_FROM_CART': {
            const newItems = state.items.filter(item => item.id !== action.payload);
            const subtotal = calculateSubtotal(newItems);
            const discount = calculateDiscount(subtotal, state.promoCode);
            const total = calculateTotal(subtotal, discount);

            return {
                ...state,
                items: newItems,
                subtotal,
                discount,
                total,
                itemCount: calculateItemCount(newItems),
            };
        }

        case 'UPDATE_QUANTITY': {
            const { id, quantity } = action.payload;
            
            // Si la cantidad es 0 o menor, remover el item
            if (quantity <= 0) {
                const newItems = state.items.filter(item => item.id !== id);
                const subtotal = calculateSubtotal(newItems);
                const discount = calculateDiscount(subtotal, state.promoCode);
                const total = calculateTotal(subtotal, discount);

                return {
                    ...state,
                    items: newItems,
                    subtotal,
                    discount,
                    total,
                    itemCount: calculateItemCount(newItems),
                };
            }

            // Actualizar la cantidad con validación de stock
            const newItems = state.items.map(item => {
                if (item.id === id) {
                    const stockDisponible = item.stock ?? 0;
                    // Limitar la cantidad al stock disponible
                    const cantidadFinal = Math.min(quantity, stockDisponible);
                    if (quantity > stockDisponible) {
                        console.warn(`Stock máximo disponible: ${stockDisponible} unidades`);
                    }
                    return { ...item, quantity: cantidadFinal };
                }
                return item;
            });

            const subtotal = calculateSubtotal(newItems);
            const discount = calculateDiscount(subtotal, state.promoCode);
            const total = calculateTotal(subtotal, discount);

            return {
                ...state,
                items: newItems,
                subtotal,
                discount,
                total,
                itemCount: calculateItemCount(newItems),
            };
        }

        case 'APPLY_PROMO_CODE': {
            const subtotal = calculateSubtotal(state.items);
            const discount = calculateDiscount(subtotal, action.payload);
            const total = calculateTotal(subtotal, discount);

            return {
                ...state,
                promoCode: action.payload,
                discount,
                total,
            };
        }

        case 'REMOVE_PROMO_CODE': {
            const subtotal = calculateSubtotal(state.items);
            const total = calculateTotal(subtotal, 0);

            return {
                ...state,
                promoCode: null,
                discount: 0,
                total,
            };
        }

        case 'CLEAR_CART':
            return initialState;

        case 'LOAD_CART':
            return action.payload;

        default:
            return state;
    }
};

// Provider del carrito
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, dispatch] = useReducer(cartReducer, initialState);

    // Cargar el carrito desde localStorage al iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                dispatch({ type: 'LOAD_CART', payload: parsedCart });
            } catch {
                // Si hay error, usar carrito vacío
                localStorage.removeItem('cart');
            }
        }
    }, []);

    // Guardar el carrito en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Funciones públicas del contexto
    const addToCart = (producto: Producto) => {
        dispatch({ type: 'ADD_TO_CART', payload: producto });
    };

    const removeFromCart = (id: number) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const updateQuantity = (id: number, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    const applyPromoCode = (code: string): boolean => {
        const upperCode = code.toUpperCase().trim();
        const discount = VALID_PROMO_CODES[upperCode];

        if (discount !== undefined) {
            dispatch({
                type: 'APPLY_PROMO_CODE',
                payload: {
                    code: upperCode,
                    discount,
                    isValid: true,
                },
            });
            return true;
        }

        return false;
    };

    const removePromoCode = () => {
        dispatch({ type: 'REMOVE_PROMO_CODE' });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                applyPromoCode,
                removePromoCode,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
