export type Rol = 'ADMIN' | 'VENDEDOR' | 'OPERADOR';

export interface UsuarioResponse {
  id: number;
  username: string;
  rol: Rol;
  estado: boolean;
}

export interface UsuarioCreateRequest {
  username: string;
  passwordPlain: string;
  rol: Rol;
}
