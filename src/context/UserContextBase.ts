import { createContext } from 'react';
import type { Usuario } from '../data/Usuario';

export interface UserContextType {
    user: Usuario | null;
    login: (email: string, password?: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    updateUserData: (usuarioActualizado: Partial<Usuario>) => Promise<void>;
    updateUserProfile?: (usuario: Usuario) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
