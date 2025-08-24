import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

// Interfaces para tipado fuerte
export interface LoginRequest {
  username: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
}

// Información que esperamos encontrar dentro del token decodificado
export interface DecodedToken {
  sub: string; // Subject (generalmente el username)
  userId: number; // El ID del usuario (¡asegúrate que tu backend lo incluya en el token!)
  roles: string[]; // Los roles del usuario
  iat: number; // Issued at
  exp: number; // Expiration time
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private API_URL = '/api/auth'; // Usamos el proxy

  // BehaviorSubject para mantener el estado del usuario en toda la app
  private currentUserSubject = new BehaviorSubject<DecodedToken | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Al iniciar, intenta cargar y decodificar el token existente
    this.loadUserFromToken();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.decodeAndStoreUser(response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    // Opcional: Redirigir al login
    // this.router.navigate(['/login']);
  }

  public get token(): string | null {
    return localStorage.getItem('token');
  }

  public get currentUserValue(): DecodedToken | null {
    return this.currentUserSubject.value;
  }

  public getUserId(): number | null {
    return this.currentUserValue ? this.currentUserValue.userId : null;
  }

  private loadUserFromToken(): void {
    const token = this.token;
    if (token) {
      this.decodeAndStoreUser(token);
    }
  }

  private decodeAndStoreUser(token: string): void {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      // Comprobar si el token ha expirado
      if (decodedToken.exp * 1000 > Date.now()) {
        this.currentUserSubject.next(decodedToken);
      } else {
        // Token expirado, limpiar
        this.logout();
      }
    } catch (error) {
      console.error('Error al decodificar el token', error);
      this.logout();
    }
  }
}
