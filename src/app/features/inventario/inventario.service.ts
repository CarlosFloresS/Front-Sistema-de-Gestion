import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Importamos los modelos que necesitará este servicio
import { MovimientoInventarioResponse, AjusteInventarioRequest } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private http = inject(HttpClient);
  private apiUrl = '/api/inventario';

  /** Obtiene el historial de movimientos de un producto específico */
  getHistorialDeMovimientos(productoId: number): Observable<MovimientoInventarioResponse[]> {
    return this.http.get<MovimientoInventarioResponse[]>(`${this.apiUrl}/productos/${productoId}/historial`);
  }

  /** Registra un ajuste manual de inventario.
   *  NOTA: El ID del usuario que ajusta se envía en una cabecera.
   */
  registrarAjuste(request: AjusteInventarioRequest): Observable<MovimientoInventarioResponse> {
    return this.http.post<MovimientoInventarioResponse>(`${this.apiUrl}/ajustes`, request);
  }
}
