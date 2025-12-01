package com.prodbackend.apiproducts.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.prodbackend.apiproducts.entity.Producto;
import com.prodbackend.apiproducts.repository.ProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<Producto> listarProductos(){
        return productoRepository.findAll();
    }

    public Producto buscarProductoPorId(Long id){
        return productoRepository.findById(id).orElse(null);
    }

    public Producto guardarProducto(Producto p){
        return productoRepository.save(p);
    }

    public Producto actualizarProducto(Producto p){
        if (p.getId() == null || !productoRepository.existsById(p.getId())) {
            throw new IllegalArgumentException("El producto no existe");
        }
        return productoRepository.save(p);
    }

    public void eliminarProducto(Long id){
        productoRepository.deleteById(id);
    }
}
