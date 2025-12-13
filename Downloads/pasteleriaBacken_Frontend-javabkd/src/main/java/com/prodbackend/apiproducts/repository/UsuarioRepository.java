package com.prodbackend.apiproducts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.prodbackend.apiproducts.entity.Usuario;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM Usuario u WHERE u.email NOT LIKE '%@admin.com'")
    List<Usuario> findAllExceptAdmin();
}
