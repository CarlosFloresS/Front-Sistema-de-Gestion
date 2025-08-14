import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface LoginResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API}/login`, { username, password })
      .pipe(tap(r => localStorage.setItem('token', r.token)));
  }

  logout(): void { localStorage.removeItem('token'); }
  get token(): string|null { return localStorage.getItem('token'); }
}
