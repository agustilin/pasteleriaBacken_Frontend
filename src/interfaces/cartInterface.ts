import type { Producto } from "../data/productos";

// Item en el carrito (Producto + cantidad)
export interface CartItem extends Producto {
    quantity: number;
}

// Código promocional
export interface PromoCode {
    code: string;
    discount: number; // Porcentaje de descuento (0-100)
    isValid: boolean;
}

// Estado del carrito
export interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
    promoCode: PromoCode | null;
    subtotal: number;
    discount: number;
}

export type CartAction =
    | { type: 'ADD_TO_CART'; payload: Producto }
    | { type: 'REMOVE_FROM_CART'; payload: number } // id del producto
    | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
    | { type: 'APPLY_PROMO_CODE'; payload: PromoCode }
    | { type: 'REMOVE_PROMO_CODE' }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; payload: CartState };

// Tipo del contexto
export interface CartContextType {
    cart: CartState;
    addToCart: (producto: Producto) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    applyPromoCode: (code: string) => boolean;
    removePromoCode: () => void;
    clearCart: () => void;
}
