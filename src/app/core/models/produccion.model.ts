export interface ProduccionRequest {
  productoId: number;
  cantidad: number;
}

export interface ProduccionResponse {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  costoUnitarioAlProducir: number;
  costoTotalProduccion: number;
  fecha: string; // ISO Date String
  operarioId: number;
  operarioUsername: string;
}
