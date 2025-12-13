import { useState } from 'react';
import type { Usuario } from '../../../data/Usuario';

interface UserItemProps {
    usuario: Usuario;
    onEdit: (usuario: Usuario) => void;
    onDelete: (id: number) => void;
}

export const UserItem = ({ usuario, onEdit, onDelete }: UserItemProps) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = () => {
        if (usuario.id) {
            onDelete(usuario.id);
        }
        setShowDeleteConfirm(false);
    };

    return (
        <div className="bg-rose-200 border border-gray-400 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg">{usuario.nombre}</h3>
                    <p className="text-sm text-gray-600">{usuario.email}</p>
                    <p className="text-sm text-gray-600">{usuario.telefono}</p>
                </div>

                {/* Badges de beneficios */}
                <div className="flex flex-wrap gap-1 justify-end">
                    {usuario.esMayorDe50 && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            50% Mayor 50
                        </span>
                    )}
                    {usuario.tieneDescuentoFelices50 && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            10% FELICES50
                        </span>
                    )}
                    {usuario.esDuocUC && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            🎂 Duoc UC
                        </span>
                    )}
                </div>
            </div>

            <div className="text-sm text-gray-600 mb-3">
                <p><span className="font-medium">Dirección:</span> {usuario.direccion}</p>
                <p><span className="font-medium">Fecha de Nacimiento:</span> {new Date(usuario.fechaNacimiento).toLocaleDateString('es-CL')}</p>
                {usuario.descuentoPorcentaje > 0 && (
                    <p className="text-rose-600 font-medium">
                        Descuento activo: {usuario.descuentoPorcentaje}%
                    </p>
                )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 justify-end">
                <button
                    onClick={() => onEdit(usuario)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                    Editar
                </button>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                    Eliminar
                </button>
            </div>

            {/* Modal de confirmación de eliminación */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
                        <h3 className="text-xl font-bold mb-4">Confirmar eliminación</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que deseas eliminar al usuario "{usuario.nombre}"? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
