// src/app/features/productos/product.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// CAMBIO: Importamos los nuevos modelos, no el antiguo 'Producto'
import { ProductoRequest, ProductoResponse } from '@core/models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = '/api/productos';

  listarActivos(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(this.apiUrl);
  }

  listarTodos(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.apiUrl}/todos`);
  }

  getById(id: number): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/${id}`);
  }

  registrar(producto: ProductoRequest): Observable<ProductoResponse> {
    return this.http.post<ProductoResponse>(this.apiUrl, producto);
  }

  actualizar(id: number, producto: ProductoRequest): Observable<ProductoResponse> {
    return this.http.put<ProductoResponse>(`${this.apiUrl}/${id}`, producto);
  }

  // CAMBIO: Añadido el método 'desactivar'
  desactivar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // CAMBIO: Añadido el método 'activar'
  activar(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/activar`, null);
  }
}
