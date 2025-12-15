import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import { usePedidos } from "../context/PedidosContext";
import { RestrictedAccess } from "../components/account/RestrictedAccess";
import { UserProfile } from "../components/account/UserProfile";
import { OrdersList } from "../components/account/OrdersList";
import { UserForm } from "../components/admin/usuarios/UserForm";
import { useNotification } from "../context/NotificationContext";
import type { Usuario } from "../data/Usuario";

export const CuentaPage = () => {
    const { user, logout, isAuthenticated, updateUserData, updateUserProfile } = useUser();
    const { obtenerPedidosUsuario } = usePedidos();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [showEditForm, setShowEditForm] = useState(false);

    if (!isAuthenticated || !user) {
        return <RestrictedAccess />;
    }

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleEditProfile = () => {
        setShowEditForm(true);
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
    };

    const handleSubmitEdit = async (usuarioActualizado: Usuario) => {
        try {
            if (user?.id) {
                // Construir payload permitido (sin cambiar email)
                const payload = {
                    nombre: usuarioActualizado.nombre,
                    telefono: Number(usuarioActualizado.telefono || 0),
                    fechaNacimiento: usuarioActualizado.fechaNacimiento,
                    direccion: usuarioActualizado.direccion,
                    codigoPromocional: usuarioActualizado.codigoPromocional,
                    // Beneficios calculados ya vienen del formulario
                    esDuocUC: usuarioActualizado.esDuocUC,
                    esMayorDe50: usuarioActualizado.esMayorDe50,
                    tieneDescuentoFelices50: usuarioActualizado.tieneDescuentoFelices50,
                    descuentoPorcentaje: usuarioActualizado.descuentoPorcentaje,
                    tortaGratisCumpleanosDisponible: usuarioActualizado.tortaGratisCumpleanosDisponible,
                    tortaGratisCumpleanosUsada: usuarioActualizado.tortaGratisCumpleanosUsada,
                    añoTortaGratisCumpleanos: usuarioActualizado.añoTortaGratisCumpleanos,
                } as Partial<Usuario>;

                // Usar UserContext para actualizar datos del propio usuario
                await updateUserData(payload);
                // Sincronizar perfil local inmediatamente
                if (updateUserProfile) updateUserProfile({ ...user, ...payload });
                showNotification({
                    type: 'success',
                    title: 'Perfil actualizado',
                    message: 'Tu información ha sido actualizada exitosamente.',
                });
                setShowEditForm(false);
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            showNotification({
                type: 'error',
                title: 'Error al actualizar',
                message: 'No se pudo actualizar tu perfil. Intenta nuevamente.',
            });
        }
    };

    const pedidosUsuario = obtenerPedidosUsuario(user.email);

    return (
        <div className="py-8 px-4">
            <h1 className="bg-rose-200 p-4 rounded-4xl text-center text-4xl font-bold mb-8">Mi Cuenta</h1>

            <div className="max-w-6xl mx-auto">
                <UserProfile user={user} onLogout={handleLogout} onEdit={handleEditProfile} />
                <OrdersList pedidos={pedidosUsuario} />
            </div>

            {showEditForm && (
                <UserForm
                    usuario={user}
                    onSubmit={handleSubmitEdit}
                    onCancel={handleCancelEdit}
                />
            )}
        </div>
    );
};
