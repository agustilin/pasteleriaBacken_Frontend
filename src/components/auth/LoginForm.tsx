import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { InputField } from "./InputField";
import { RememberMeCheckbox } from "./RememberMeCheckbox";
import { ForgotPasswordLink } from "./ForgotPasswordLink";
import { useUser } from "../../context/useUser";
import { AUTH_MESSAGES } from "../../constants/messages";
import { esAdmin } from "../../data/Usuario";
import { useNotification } from "../../context/NotificationContext";

interface LoginFormData {
    email: string;
    password: string;
}

export const LoginForm = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const { login } = useUser();
    const { showNotification } = useNotification();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            showNotification({
                type: 'warning',
                title: 'Campos requeridos',
                message: "Por favor ingresa email y contraseña",
            });
            return;
        }
        
        try {
            // Hacer login con email y password 
            await login(formData.email, formData.password);
            
            // Login exitoso
            showNotification({
                type: 'success',
                title: 'Sesión iniciada',
                message: "¡Sesión iniciada exitosamente!",
            });
            
            if(esAdmin(formData.email)){
                showNotification({
                    type: 'info',
                    title: 'Bienvenido',
                    message: "¡Bienvenido Administrador!",
                });
                navigate("/admin");
            } else {
                navigate("/account");
            }
        } catch (error) {
            // Mostrar error de credenciales
            const errorMessage = error instanceof Error ? error.message : AUTH_MESSAGES.LOGIN_ERROR;
            
            if (errorMessage.includes("Email o contraseña")) {
                showNotification({
                    type: 'error',
                    title: 'Credenciales inválidas',
                    message: "Email o contraseña incorrectos",
                });
            } else if (errorMessage.includes("no encontrado") || errorMessage.includes("not found")) {
                showNotification({
                    type: 'info',
                    title: 'Usuario no registrado',
                    message: AUTH_MESSAGES.EMAIL_NOT_REGISTERED,
                });
            } else {
                showNotification({
                    type: 'error',
                    title: 'No se pudo iniciar sesión',
                    message: errorMessage,
                });
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                    label="Correo electrónico"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    icon={HiMail}
                />

                <InputField
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={HiLockClosed}
                />

                <div className="flex items-center justify-between">
                    <RememberMeCheckbox />
                    <ForgotPasswordLink />
                </div>

                <button
                    type="submit"
                    className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors font-medium"
                >
                    Iniciar Sesión
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <Link to="/registro" className="text-rose-600 hover:text-rose-700 font-medium">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};
