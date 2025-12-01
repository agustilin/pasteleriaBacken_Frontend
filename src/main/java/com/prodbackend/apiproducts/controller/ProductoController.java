package com.prodbackend.apiproducts.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodbackend.apiproducts.entity.Producto;
import com.prodbackend.apiproducts.service.ProductoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    public final ProductoService productoServ;

    @GetMapping
    public List<Producto> listarProductos(){
        return productoServ.listarProductos();
    }

    @GetMapping("/{id}")
    public Producto buscarProductoPorId(@PathVariable Long id){
        return productoServ.buscarProductoPorId(id);
    }

    @PostMapping
    public Producto guardarProducto(@RequestBody Producto p){
        return productoServ.guardarProducto(p);
    }

    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto p){
        // Asegurar que el id del path se use
        p.setId(id);
        return productoServ.actualizarProducto(p);
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id){
        productoServ.eliminarProducto(id);
    }


}
