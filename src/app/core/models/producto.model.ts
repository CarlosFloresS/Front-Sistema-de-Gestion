// src/app/core/models/producto.model.ts

// Modelo para recibir datos del backend (GET, respuestas de POST/PUT)
export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  costo: number;
  stock: number;
  estado: boolean;
}

// Modelo para enviar datos al backend (cuerpo de POST/PUT)
export interface ProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  costo: number;
}
