export interface MermaRequest {
  productoId: number;
  cantidad: number;
  motivo: string;
}

export interface MermaResponse {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  motivo: string;
  fecha: string; // ISO Date String
  operarioId: number;
  operarioUsername: string;
}
