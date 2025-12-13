package com.prodbackend.apiproducts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prodbackend.apiproducts.entity.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
}
