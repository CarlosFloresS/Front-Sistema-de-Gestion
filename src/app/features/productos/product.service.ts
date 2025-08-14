// src/app/productos/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto }   from '../../core/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {}

  /** Listar todos los productos */
  list(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl);
  }

  /** Obtener un producto por su ID */
  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  /** Crear un nuevo producto */
  create(p: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, p);
  }

  /** Actualizar un producto existente */
  update(id: number, p: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, p);
  }

  /** Eliminar un producto */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
