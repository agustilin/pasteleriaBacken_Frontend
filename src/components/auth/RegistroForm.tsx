import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiMail, HiLockClosed, HiUser, HiPhone, HiCalendar, HiLocationMarker, HiTag } from "react-icons/hi";
import { InputField } from "./InputField";
import { useUser } from "../../context/useUser";
import { calcularEdad, esDuocEmail, type Usuario } from "../../data/Usuario";
import { AUTH_MESSAGES } from "../../constants/messages";
import { createUsuario, checkEmailExists } from "../../api/usuarios.service";
import { useNotification } from "../../context/NotificationContext";

interface RegistroFormData {
    nombre: string;
    email: string;
    telefono: number;
    fechaNacimiento: string;
    direccion: string;
    codigoPromocional: string;
    password: string;
    confirmPassword: string;
}

export const RegistroForm = () => {
    const [formData, setFormData] = useState<RegistroFormData>({
        nombre: "",
        email: "",
        telefono: 0,
        fechaNacimiento: "",
        direccion: "",
        codigoPromocional: "",
        password: "",
        confirmPassword: ""
    });
    const [promoInfo, setPromoInfo] = useState<string>("");
    const navigate = useNavigate();
    const { login } = useUser();
    const { showNotification } = useNotification();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // normalizar telefono como número
        if (name === 'telefono') {
            const numeric = value.replace(/[^0-9]/g, '');
            setFormData({
                ...formData,
                telefono: numeric ? Number(numeric) : 0,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        // Mostrar información de promociones aplicables
        if (name === 'email') {
            if (esDuocEmail(value)) {
                setPromoInfo(" ¡Correo Duoc UC detectado! Recibirás una torta gratis en tu cumpleaños.");
            } 
            else {
                setPromoInfo("");
            }
        }

        if (name === 'codigoPromocional' && value.toUpperCase() === 'FELICES50') {
            setPromoInfo("🎉 ¡Código válido! Recibirás 10% de descuento de por vida.");
        } else if (name === 'codigoPromocional' && value === '') {
            setPromoInfo("");
        }
    };

    const validateAge = (fechaNacimiento: string): boolean => {
        const today = new Date();
        const birthDate = new Date(fechaNacimiento);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Ajustar edad si aún no ha cumplido años este año
        const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ? age - 1
            : age;

        return adjustedAge <= 102 && adjustedAge >= 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar que no intente crear cuenta de administrador
        const emailLowercase = formData.email.toLowerCase();
        if (emailLowercase.includes("@admin") || emailLowercase.includes("admin")) {
            showNotification({
                type: 'warning',
                title: 'Correo no permitido',
                message: "No se permiten crear cuentas con correos de administrador.\n\nPor favor, utiliza un correo válido.",
            });
            // Limpiar todos los campos
                setFormData({
                    nombre: "",
                    email: "",
                    telefono: 0,
                    fechaNacimiento: "",
                    direccion: "",
                    codigoPromocional: "",
                    password: "",
                    confirmPassword: ""
                });
            setPromoInfo("");
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            showNotification({
                type: 'warning',
                title: 'Contraseñas no coinciden',
                message: "Las contraseñas no coinciden",
            });
            return;
        }

        if (!validateAge(formData.fechaNacimiento)) {
            showNotification({
                type: 'warning',
                title: 'Fecha no válida',
                message: "La fecha de nacimiento no es válida. La edad debe ser menor o igual a 102 años.",
            });
            return;
        }

        // Calcular edad del usuario
        const edad = calcularEdad(formData.fechaNacimiento);
        const esMayorDe50 = edad >= 50;
        const esDuoc = esDuocEmail(formData.email);
        const tieneCodigoFelices50 = formData.codigoPromocional.toUpperCase() === 'FELICES50';

        // Calcular descuento aplicable (el mayor descuento gana)
        let descuentoPorcentaje = 0;
        const beneficios: string[] = [];

        if (esMayorDe50) {
            descuentoPorcentaje = 50;
            beneficios.push("50% de descuento por ser mayor de 50 años");
        } else if (tieneCodigoFelices50) {
            descuentoPorcentaje = 10;
            beneficios.push("10% de descuento de por vida con código FELICES50");
        }

        if (esDuoc) {
            beneficios.push("Torta gratis en tu cumpleaños como estudiante Duoc UC");
        }

        // Crear objeto usuario
        const nuevoUsuario: Usuario = {
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password,
            telefono: formData.telefono,
            fechaNacimiento: formData.fechaNacimiento,
            direccion: formData.direccion,
            codigoPromocional: formData.codigoPromocional,
            esDuocUC: esDuoc,
            esMayorDe50: esMayorDe50,
            tieneDescuentoFelices50: tieneCodigoFelices50,
            descuentoPorcentaje: descuentoPorcentaje,
            tortaGratisCumpleanosDisponible: esDuoc,
            tortaGratisCumpleanosUsada: false,
        };

        // Verificar si el email ya existe en la base de datos
        try {
            const emailExiste = await checkEmailExists(formData.email);
            if (emailExiste) {
                showNotification({
                    type: 'info',
                    title: 'Email registrado',
                    message: AUTH_MESSAGES.EMAIL_ALREADY_REGISTERED,
                });
                navigate("/login");
                return;
            }
        } catch {
            showNotification({
                type: 'error',
                message: "Error verificando email. Por favor intenta de nuevo.",
            });
            return;
        }

        // Crear usuario en la base de datos
        try {
            await createUsuario(nuevoUsuario);
            
            // Iniciar sesión automáticamente con el email
            await login(formData.email);
            
            // Mostrar mensaje con beneficios
            let mensaje = "¡Cuenta creada exitosamente!";
            if (beneficios.length > 0) {
                mensaje += "\n\nTus beneficios:\n• " + beneficios.join("\n• ");
            }

            showNotification({
                type: 'success',
                title: 'Cuenta creada',
                message: mensaje,
            });

            navigate("/account");
            
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Error al crear la cuenta";
            showNotification({
                type: 'error',
                title: 'No se pudo crear la cuenta',
                message: "Error al crear cuenta: " + errorMessage,
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
                <InputField
                    label="Nombre completo"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    icon={HiUser}
                />

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
                    label="Teléfono"
                    type="number"
                    name="telefono"
                    value={String(formData.telefono)}
                    onChange={handleChange}
                    placeholder="56912345678"
                    icon={HiPhone}
                />

                <InputField
                    label="Fecha de nacimiento"
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    placeholder=""
                    icon={HiCalendar}
                />

                <InputField
                    label="Dirección"
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Calle, número, comuna"
                    icon={HiLocationMarker}
                />

                <div>
                    <InputField
                        label="Código promocional (opcional)"
                        type="text"
                        name="codigoPromocional"
                        value={formData.codigoPromocional}
                        onChange={handleChange}
                        placeholder="Ej: FELICES50"
                        icon={HiTag}
                        required={false}
                    />
                    {promoInfo && (
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                            {promoInfo}
                        </p>
                    )}
                </div>

                <InputField
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={HiLockClosed}
                    minLength={6}
                />

                <InputField
                    label="Confirmar contraseña"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={HiLockClosed}
                    minLength={6}
                />


                <button
                    type="submit"
                    className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors font-medium"
                >
                    Crear Cuenta
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-rose-600 hover:text-rose-700 font-medium">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};
