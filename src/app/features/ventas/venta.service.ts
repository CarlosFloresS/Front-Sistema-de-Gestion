import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateVenta {
  productoId: number;
  cantidad:   number;
}

export interface Venta {
  id?:         number;
  productoId:  number;
  fecha:       string;
  cantidad:    number;
  total?:      number;
}

@Injectable({ providedIn: 'root' })
export class VentaService {
  private baseUrl = 'http://localhost:8080/api/ventas';
  constructor(private http: HttpClient) {}
  list(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.baseUrl);
  }
  create(dto: CreateVenta): Observable<Venta> {
    return this.http.post<Venta>(this.baseUrl, dto);
  }
}
