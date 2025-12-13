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
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("El usuario no existe");
        }
        usuarioActualizado.setId(id);
        return usuarioRepository.save(usuarioActualizado);
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
