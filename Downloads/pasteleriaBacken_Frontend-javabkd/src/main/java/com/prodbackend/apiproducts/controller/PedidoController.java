package com.prodbackend.apiproducts.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodbackend.apiproducts.dto.PedidoCreateRequest;
import com.prodbackend.apiproducts.entity.Pedido;
import com.prodbackend.apiproducts.service.PedidoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody PedidoCreateRequest req) {
        try {
            Pedido creado = pedidoService.crearPedido(req);
            return ResponseEntity.ok(creado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", "Error al crear pedido"));
        }
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    @GetMapping("/usuario/{email}")
    public ResponseEntity<List<Pedido>> listarPorUsuario(@PathVariable String email) {
        return ResponseEntity.ok(pedidoService.listarPedidosUsuario(email));
    }
}
