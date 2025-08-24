// src/app/features/mermas/merma.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MermaRequest, MermaResponse } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class MermaService {
  private http = inject(HttpClient);
  private apiUrl = '/api/mermas';

  /** Lista todas las mermas registradas */
  listar(): Observable<MermaResponse[]> {
    return this.http.get<MermaResponse[]>(this.apiUrl);
  }

  /** Registra una nueva merma.
   *  NOTA: El ID del operario se envía en una cabecera, gestionado por un interceptor.
   */
  registrar(request: MermaRequest): Observable<MermaResponse> {
    return this.http.post<MermaResponse>(this.apiUrl, request);
  }
}
