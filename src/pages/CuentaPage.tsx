import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import { usePedidos } from "../context/PedidosContext";
import { RestrictedAccess } from "../components/account/RestrictedAccess";
import { UserProfile } from "../components/account/UserProfile";
import { OrdersList } from "../components/account/OrdersList";

export const CuentaPage = () => {
    const { user, logout, isAuthenticated } = useUser();
    const { obtenerPedidosUsuario } = usePedidos();
    const navigate = useNavigate();

    if (!isAuthenticated || !user) {
        return <RestrictedAccess />;
    }

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const pedidosUsuario = obtenerPedidosUsuario(user.email);

    return (
        <div className="py-8 px-4">
            <h1 className="bg-rose-200 p-4 rounded-4xl text-center text-4xl font-bold mb-8">Mi Cuenta</h1>

            <div className="max-w-6xl mx-auto">
                <UserProfile user={user} onLogout={handleLogout} />
                <OrdersList pedidos={pedidosUsuario} />
            </div>
        </div>
    );
};
