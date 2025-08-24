export interface MovimientoInventarioResponse {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  tipo: 'PRODUCCION' | 'VENTA' | 'MERMA' | 'AJUSTE_INICIAL' | 'CORRECCION';
  origenId: number;
  stockResultante: number;
  fecha: string; // ISO Date String
  motivo: string;
}

export interface AjusteInventarioRequest {
  productoId: number;
  cantidadAjuste: number;
  motivo: string;
}
