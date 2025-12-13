package com.prodbackend.apiproducts.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "usuarios")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 20)
    private String telefono;

    @Column(nullable = false)
    private LocalDate fechaNacimiento;

    @Column(length = 255)
    private String direccion;

    @Column(length = 50)
    private String codigoPromocional;

    @Column(nullable = false)
    private Boolean esDuocUC = false;

    @Column(nullable = false)
    private Boolean esMayorDe50 = false;

    @Column(nullable = false)
    private Boolean tieneDescuentoFelices50 = false;

    @Column(nullable = false)
    private Integer descuentoPorcentaje = 0;

    @Column(nullable = false)
    private Boolean tortaGratisCumpleanosDisponible = true;

    @Column(nullable = false)
    private Boolean tortaGratisCumpleanosUsada = false;

    @Column
    private Integer añoTortaGratisCumpleanos;
}
