import { useState } from 'react';
import { useAdmin } from '../../../context/useAdmin';
import { UserItem } from './UserItem';
import { UserForm } from './UserForm';
import type { Usuario } from '../../../data/Usuario';
import { useNotification } from '../../../context/NotificationContext';

export const UserList = () => {
    const { usuarios, actualizarUsuario, eliminarUsuario } = useAdmin();
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<Usuario | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBeneficios, setFilterBeneficios] = useState<string>('todos');
    const { showNotification } = useNotification();

    // Filtrar usuarios
    const usuariosFiltrados = usuarios.filter(usuario => {
        const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesBeneficio = true;
        if (filterBeneficios === 'mayor50') {
            matchesBeneficio = usuario.esMayorDe50;
        } else if (filterBeneficios === 'felices50') {
            matchesBeneficio = usuario.tieneDescuentoFelices50;
        } else if (filterBeneficios === 'duoc') {
            matchesBeneficio = usuario.esDuocUC;
        }
        
        return matchesSearch && matchesBeneficio;
    });

    const handleEditUser = (usuario: Usuario) => {
        setEditingUser(usuario);
        setShowForm(true);
    };

    const handleSubmit = (usuario: Usuario) => {
        if (editingUser && editingUser.id) {
            // Actualizar usuario existente
            actualizarUsuario(editingUser.id, usuario);
        } else {
            // No permitir agregar usuarios desde el admin (solo editar)
            // Los usuarios deben registrarse desde el formulario de registro
            showNotification({
                type: 'info',
                title: 'Registro de usuarios',
                message: 'Los usuarios deben registrarse desde la página de registro',
            });
            return;
        }
        setShowForm(false);
        setEditingUser(undefined);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingUser(undefined);
    };

    // Estadísticas
    const totalUsuarios = usuarios.length;
    const usuariosConDescuento = usuarios.filter(u => u.descuentoPorcentaje > 0).length;
    const usuariosDuoc = usuarios.filter(u => u.esDuocUC).length;

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
                    <div className="text-sm text-gray-600">
                        Los usuarios se registran desde la página de registro
                    </div>
                </div>

                {/* Barra de búsqueda */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                </div>

                {/* Filtros */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filtrar por beneficio
                    </label>
                    <select
                        value={filterBeneficios}
                        onChange={(e) => setFilterBeneficios(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                        <option value="todos">Todos los usuarios</option>
                        <option value="mayor50">Mayores de 50 (50% descuento)</option>
                        <option value="felices50">Con código FELICES50 (10% descuento)</option>
                        <option value="duoc">Duoc UC (Torta gratis)</option>
                    </select>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Usuarios</p>
                    <p className="text-2xl font-bold text-blue-600">{totalUsuarios}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Con Descuento</p>
                    <p className="text-2xl font-bold text-green-600">{usuariosConDescuento}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Duoc UC</p>
                    <p className="text-2xl font-bold text-purple-600">{usuariosDuoc}</p>
                </div>
            </div>

            {/* Lista de usuarios */}
            <div className="space-y-4">
                {usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map(usuario => (
                        <UserItem
                            key={usuario.email}
                            usuario={usuario}
                            onEdit={handleEditUser}
                            onDelete={eliminarUsuario}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No se encontraron usuarios</p>
                    </div>
                )}
            </div>

            {/* Formulario modal */}
            {showForm && editingUser && (
                <UserForm
                    usuario={editingUser}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};
