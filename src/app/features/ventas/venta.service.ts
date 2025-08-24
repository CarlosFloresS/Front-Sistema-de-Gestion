import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// ¡VOLVEMOS AL MODELO ORIGINAL!
import { VentaRequest, VentaResponse } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private http = inject(HttpClient);
  private apiUrl = '/api/ventas';

  // El método vuelve a aceptar el DTO de un solo producto
  registrar(venta: VentaRequest): Observable<VentaResponse> {
    return this.http.post<VentaResponse>(this.apiUrl, venta);
  }

  // ... otros métodos ...
  listar(): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(this.apiUrl);
  }
}
