// src/app/features/producciones/produccion.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProduccionRequest, ProduccionResponse } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {
  private http = inject(HttpClient);
  private apiUrl = '/api/producciones';

  /** Lista todos los registros de producción */
  listar(): Observable<ProduccionResponse[]> {
    return this.http.get<ProduccionResponse[]>(this.apiUrl);
  }

  /** Registra un nuevo lote de producción.
   *  NOTA: El ID del operario se envía en una cabecera, gestionado por un interceptor.
   */
  registrar(request: ProduccionRequest): Observable<ProduccionResponse> {
    return this.http.post<ProduccionResponse>(this.apiUrl, request);
  }
}
