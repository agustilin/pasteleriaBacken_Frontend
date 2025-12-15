package com.prodbackend.apiproducts.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.prodbackend.apiproducts.entity.Usuario;
import com.prodbackend.apiproducts.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAllExceptAdmin();
    }

    public List<Usuario> listarTodosLosUsuarios() {
        return usuarioRepository.findAllExceptAdmin();
    }

    public Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario buscarUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }

    public Usuario guardarUsuario(Usuario usuario) {
        if (usuario.getEmail() != null && usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("El email ya existe registrado");
        }
        // Guardar contraseña sin encriptación (proyecto universitario)
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        Usuario existente = usuarioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("El usuario no existe"));

        // No permitir cambio de email ni password vía este endpoint
        // Conservar email y password originales
        usuarioActualizado.setId(id);
        usuarioActualizado.setEmail(existente.getEmail());
        usuarioActualizado.setPassword(existente.getPassword());

        // Normalizar tipos: telefono como String, fechaNacimiento como LocalDate ya debería venir correctamente
        // Copiar campos editables
        existente.setNombre(usuarioActualizado.getNombre());
        existente.setTelefono(usuarioActualizado.getTelefono());
        existente.setFechaNacimiento(usuarioActualizado.getFechaNacimiento());
        existente.setDireccion(usuarioActualizado.getDireccion());
        existente.setCodigoPromocional(usuarioActualizado.getCodigoPromocional());
        existente.setEsDuocUC(usuarioActualizado.getEsDuocUC());
        existente.setEsMayorDe50(usuarioActualizado.getEsMayorDe50());
        existente.setTieneDescuentoFelices50(usuarioActualizado.getTieneDescuentoFelices50());
        existente.setDescuentoPorcentaje(usuarioActualizado.getDescuentoPorcentaje());
        existente.setTortaGratisCumpleanosDisponible(usuarioActualizado.getTortaGratisCumpleanosDisponible());
        existente.setTortaGratisCumpleanosUsada(usuarioActualizado.getTortaGratisCumpleanosUsada());
        existente.setAñoTortaGratisCumpleanos(usuarioActualizado.getAñoTortaGratisCumpleanos());

        return usuarioRepository.save(existente);
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    public boolean existeEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    public Usuario validarLogin(String email, String password) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Email o contraseña incorrectos"));
        
        // Validar contraseña en texto plano (proyecto universitario)
        if (!password.equals(usuario.getPassword())) {
            throw new IllegalArgumentException("Email o contraseña incorrectos");
        }
        
        return usuario;
    }
}
