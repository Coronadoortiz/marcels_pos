package com.marcels.pos.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FinanceReportDTO {
    private Double totalSales;      // Ingresos totales
    private Double totalPurchases;  // Egresos totales por compras
    private Double netProfit;       // Ganancia neta (Ventas - Compras)
    private Long totalSalesCount;   // Cantidad de transacciones de venta
    private Long totalPurchasesCount; // Cantidad de transacciones de compra
}