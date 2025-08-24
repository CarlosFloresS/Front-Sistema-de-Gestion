import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioResponse, UsuarioCreateRequest } from '@core/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Construimos la URL base de forma dinámica y profesional
  private readonly API_URL = `${environment.apiUrl}/usuarios`;
  private http = inject(HttpClient);

  /** Obtiene la lista completa de usuarios desde el backend. */
  listar() {
    return this.http.get<UsuarioResponse[]>(this.API_URL);
  }

  /** Envía los datos de un nuevo usuario para su creación. */
  crear(payload: UsuarioCreateRequest) {
    return this.http.post<UsuarioResponse>(this.API_URL, payload);
  }

  /** Cambia el estado (activo/inactivo) de un usuario por su ID. */
  cambiarEstado(id: number, activo: boolean) {
    return this.http.patch<UsuarioResponse>(`${this.API_URL}/${id}/estado?activo=${activo}`, {});
  }
}
