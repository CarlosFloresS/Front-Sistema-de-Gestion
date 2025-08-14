import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Merma {
  id?:        number;
  productoId: number;
  fecha:      string;  // ISO
  cantidad:   number;
  motivo:     string;
}

@Injectable({ providedIn: 'root' })
export class MermaService {
  private baseUrl = 'http://localhost:8080/api/mermas';

  constructor(private http: HttpClient) {}

  /** Listar todas las mermas */
  list(): Observable<Merma[]> {
    return this.http.get<Merma[]>(this.baseUrl);
  }

  /** Registrar nueva merma */
  create(dto: Merma): Observable<Merma> {
    return this.http.post<Merma>(this.baseUrl, dto);
  }
}
