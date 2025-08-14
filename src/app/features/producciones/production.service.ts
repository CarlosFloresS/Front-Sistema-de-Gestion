// src/app/features/producciones/production.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produccion {
  id?:         number;
  fecha:       string;  // ISO
  cantidad:    number;
  productoId:  number;  // ← relación con producto
}

@Injectable({ providedIn: 'root' })
export class ProductionService {
  private baseUrl = 'http://localhost:8080/api/producciones';

  constructor(private http: HttpClient) {}

  list(): Observable<Produccion[]> {
    return this.http.get<Produccion[]>(this.baseUrl);
  }

  getById(id: number): Observable<Produccion> {
    return this.http.get<Produccion>(`${this.baseUrl}/${id}`);
  }

  create(dto: Produccion): Observable<Produccion> {
    return this.http.post<Produccion>(this.baseUrl, dto);
  }

  update(id: number, dto: Produccion): Observable<Produccion> {
    return this.http.put<Produccion>(`${this.baseUrl}/${id}`, dto);
  }
}
