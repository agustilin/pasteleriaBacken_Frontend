package com.prodbackend.apiproducts.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "http://localhost:5173")
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
        p.setId(id);
        return productoServ.actualizarProducto(p);
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id){
        productoServ.eliminarProducto(id);
    }

    @PostMapping("/actualizar-stock")
    public ResponseEntity<?> actualizarStockMultiple(@RequestBody List<Map<String, Object>> items) {
        try {
            for (Map<String, Object> item : items) {
                Long productoId = ((Number) item.get("productoId")).longValue();
                int cantidad = ((Number) item.get("cantidad")).intValue();
                productoServ.actualizarStock(productoId, cantidad);
            }
            return ResponseEntity.ok().body(Map.of("message", "Stock actualizado correctamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al actualizar el stock"));
        }
    }

}
