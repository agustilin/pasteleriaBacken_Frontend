package com.prodbackend.apiproducts.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prodbackend.apiproducts.entity.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioEmail(String email);
}
