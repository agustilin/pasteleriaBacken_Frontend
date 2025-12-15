import { useState, useEffect, type ReactNode } from 'react';
import type { Usuario } from '../data/Usuario';
import { fetchUsuarioPorEmail, updateUsuario, login as loginAPI } from '../api/usuarios.service';
import { UserContext } from './UserContextBase';

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar usuario desde localStorage (token/email del usuario logueado)
    // En una app real, esto sería un JWT o sesión del servidor
    useEffect(() => {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            loadUserFromAPI(savedEmail);
        }
    }, []);

    const loadUserFromAPI = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            const userData = await fetchUsuarioPorEmail(email);
            setUser(userData);
        } catch (e: unknown) {
            let message = 'Error cargando usuario';
            if (e instanceof Error && e.message) {
                message = e.message;
            }
            setError(message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password?: string) => {
        setLoading(true);
        setError(null);
        try {
            // Si se proporciona password, usar endpoint de login que valida credenciales
            if (password) {
                const userData = await loginAPI(email, password);
                setUser(userData);
                localStorage.setItem('userEmail', email);
            } else {
                // Si no hay password, solo cargar el usuario (para sesiones existentes)
                const userData = await fetchUsuarioPorEmail(email);
                setUser(userData);
                localStorage.setItem('userEmail', email);
            }
        } catch (e: unknown) {
            let message = 'Error al iniciar sesión';
            if (e instanceof Error && e.message) {
                message = e.message;
            }
            setError(message);
            setUser(null);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userEmail');
        setError(null);
    };

    const updateUserData = async (usuarioActualizado: Partial<Usuario>) => {
        if (!user || !user.id) {
            throw new Error('No hay usuario logueado');
        }
        setLoading(true);
        setError(null);
        try {
            const updated = await updateUsuario(user.id, usuarioActualizado);
            setUser(updated);
        } catch (e: unknown) {
            let message = 'Error actualizando usuario';
            if (e instanceof Error && e.message) {
                message = e.message;
            }
            setError(message);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = (usuario: Usuario) => {
        setUser(usuario);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                loading,
                error,
                updateUserData,
                updateUserProfile,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
