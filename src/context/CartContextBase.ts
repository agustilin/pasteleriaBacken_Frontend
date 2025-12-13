import { createContext } from 'react';
import type { CartContextType } from '../interfaces/cartInterface';

export const CartContext = createContext<CartContextType | undefined>(undefined);
