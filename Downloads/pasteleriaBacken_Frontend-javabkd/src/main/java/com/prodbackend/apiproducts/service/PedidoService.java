package com.prodbackend.apiproducts.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.prodbackend.apiproducts.dto.PedidoCreateRequest;
import com.prodbackend.apiproducts.entity.Pedido;
import com.prodbackend.apiproducts.entity.PedidoItem;
import com.prodbackend.apiproducts.entity.Producto;
import com.prodbackend.apiproducts.entity.Usuario;
import com.prodbackend.apiproducts.repository.PedidoRepository;
import com.prodbackend.apiproducts.repository.ProductoRepository;
import com.prodbackend.apiproducts.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public Pedido crearPedido(PedidoCreateRequest req) {
        Usuario usuario = usuarioRepository.findByEmail(req.getUserEmail())
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Pedido pedido = Pedido.builder()
            .usuario(usuario)
            .fecha(LocalDateTime.now())
            .subtotal(req.getSubtotal())
            .descuentoCodigo(req.getDescuentoCodigo())
            .descuentoUsuario(req.getDescuentoUsuario())
            .total(req.getTotal())
            .codigoPromoAplicado(req.getCodigoPromoAplicado())
            .estado("completado")
            .items(new ArrayList<>())
            .build();

        for (PedidoCreateRequest.Item itemReq : req.getItems()) {
            Producto producto = productoRepository.findById(itemReq.getProductoId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + itemReq.getProductoId()));

            PedidoItem item = PedidoItem.builder()
                .pedido(pedido)
                .producto(producto)
                .quantity(itemReq.getCantidad())
                .price(producto.getPrecio())
                .build();

            pedido.getItems().add(item);
        }

        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarPedidosUsuario(String email) {
        return pedidoRepository.findByUsuarioEmail(email);
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }
}
