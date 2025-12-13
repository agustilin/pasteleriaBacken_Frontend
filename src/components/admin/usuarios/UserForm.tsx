import { useState, useEffect } from 'react';
import type { Usuario } from '../../../data/Usuario';
import { calcularEdad, esDuocEmail } from '../../../data/Usuario';

interface UserFormProps {
    usuario?: Usuario;
    onSubmit: (usuario: Usuario) => void;
    onCancel: () => void;
}

export const UserForm = ({ usuario, onSubmit, onCancel }: UserFormProps) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: 0,
        fechaNacimiento: '',
        direccion: '',
        codigoPromocional: '',
    });

    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.nombre,
                email: usuario.email,
                telefono: usuario.telefono ?? 0,
                fechaNacimiento: usuario.fechaNacimiento,
                direccion: usuario.direccion,
                codigoPromocional: usuario.codigoPromocional || '',
            });
        }
    }, [usuario]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Calcular beneficios automáticamente
        const edad = calcularEdad(formData.fechaNacimiento);
        const esMayorDe50 = edad >= 50;
        const esDuocUC = esDuocEmail(formData.email);
        const tieneDescuentoFelices50 = formData.codigoPromocional?.toUpperCase() === 'FELICES50';

        // Calcular descuento porcentaje
        let descuentoPorcentaje = 0;
        if (esMayorDe50) {
            descuentoPorcentaje = 50;
        } else if (tieneDescuentoFelices50) {
            descuentoPorcentaje = 10;
        }

        const usuarioCompleto: Usuario = {
            ...formData,
            esDuocUC,
            esMayorDe50,
            tieneDescuentoFelices50,
            descuentoPorcentaje,
            tortaGratisCumpleanosDisponible: esDuocUC,
            tortaGratisCumpleanosUsada: usuario?.tortaGratisCumpleanosUsada || false,
            añoTortaGratisCumpleanos: usuario?.añoTortaGratisCumpleanos,
        };

        onSubmit(usuarioCompleto);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'telefono') {
            const numeric = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({
                ...prev,
                telefono: numeric ? Number(numeric) : 0,
            }));
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Validación de edad máxima
    const getMaxDate = () => {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 102, today.getMonth(), today.getDate());
        return maxDate.toISOString().split('T')[0];
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className='bg-rose-200 p-8 rounded-2xl'>
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            {usuario ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    placeholder="Juan Pérez"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={!!usuario} // No permitir cambiar email al editar
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-100"
                                    placeholder="usuario@ejemplo.com"
                                />
                                {usuario && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        El email no se puede modificar
                                    </p>
                                )}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono *
                                </label>
                                <input
                                    type="number"
                                    name="telefono"
                                    value={formData.telefono || ''}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    placeholder="56912345678"
                                />
                            </div>

                            {/* Fecha de Nacimiento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de Nacimiento *
                                </label>
                                <input
                                    type="date"
                                    name="fechaNacimiento"
                                    value={formData.fechaNacimiento}
                                    onChange={handleChange}
                                    required
                                    min={getMaxDate()}
                                    max={getMinDate()}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Edad máxima: 102 años
                                </p>
                            </div>

                            {/* Dirección */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dirección *
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    placeholder="Av. Principal 123, Santiago"
                                />
                            </div>

                            {/* Código Promocional */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Código Promocional (Opcional)
                                </label>
                                <input
                                    type="text"
                                    name="codigoPromocional"
                                    value={formData.codigoPromocional}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    placeholder="FELICES50"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    FELICES50 para 10% de descuento de por vida
                                </p>
                            </div>

                            {/* Información de beneficios */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-medium text-sm mb-2">Beneficios automáticos:</h3>
                                <ul className="text-xs text-gray-700 space-y-1">
                                    <li>• Usuarios mayores de 50 años: 50% de descuento</li>
                                    <li>• Código FELICES50: 10% de descuento de por vida</li>
                                    <li>• Emails @duoc.cl/@duocuc.cl: Torta gratis en cumpleaños</li>
                                </ul>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                                >
                                    {usuario ? 'Actualizar' : 'Crear'} Usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>                    
        </div>
    );
};
