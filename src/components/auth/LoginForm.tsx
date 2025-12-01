import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { InputField } from "./InputField";
import { RememberMeCheckbox } from "./RememberMeCheckbox";
import { ForgotPasswordLink } from "./ForgotPasswordLink";
import { useUser } from "../../context/UserContext";
import { AUTH_MESSAGES } from "../../constants/messages";
import { esAdmin } from "../../data/Usuario";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Buscar usuario en la lista de usuarios registrados
        const usuariosRegistrados = localStorage.getItem('usuariosRegistrados');
        
        if (!usuariosRegistrados) {
            alert(AUTH_MESSAGES.NO_USERS_REGISTERED);
            navigate("/registro");
            return;
        }

        try {
            const listaUsuarios = JSON.parse(usuariosRegistrados);
            
            // Buscar usuario por email
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const usuarioEncontrado = listaUsuarios.find((u: any) => u.email === formData.email);
            
            if (usuarioEncontrado) {
                // Login exitoso - cargar usuario en el contexto
                login(usuarioEncontrado);
                alert("¡Sesión iniciada exitosamente!");
                navigate("/account");
            }
            if(esAdmin(formData.email)){
                alert("¡Bienvenido Administrador!");
                navigate("/admin");
            }
            else {
                alert(AUTH_MESSAGES.EMAIL_NOT_REGISTERED);
                navigate("/registro");
            }
        } catch {
            alert(AUTH_MESSAGES.LOGIN_ERROR);
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
