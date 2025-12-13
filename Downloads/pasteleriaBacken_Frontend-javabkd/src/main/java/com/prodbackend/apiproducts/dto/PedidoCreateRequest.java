package com.prodbackend.apiproducts.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoCreateRequest {
    private String userEmail;
    private List<Item> items;
    private BigDecimal subtotal;
    private BigDecimal descuentoCodigo;
    private BigDecimal descuentoUsuario;
    private BigDecimal total;
    private String codigoPromoAplicado;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Item {
        private Long productoId;
        private int cantidad;
    }
}
