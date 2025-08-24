// src/app/core/models/venta.model.ts

// ¡ESTA ES LA DEFINICIÓN CORRECTA!
// Define el payload para la venta de UN SOLO producto.
export interface VentaRequest {
  productoId: number;
  cantidad: number;
}

// La respuesta del backend. Esta no necesita cambios.
export interface VentaResponse {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitarioAlVender: number;
  totalVenta: number;
  fecha: string;
  vendedorId: number;
  vendedorUsername: string;
}

// Puedes eliminar VentaItemRequest si aún existe en este archivo,
// ya que no lo vamos a usar.
