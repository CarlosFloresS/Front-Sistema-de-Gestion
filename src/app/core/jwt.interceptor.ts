// src/app/core/jwt.interceptor.ts

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // <-- IMPORTANTE: Importa la nueva librería

// Interfaz para el payload decodificado del token. Ajústala si tu token tiene otras claves.
interface JwtPayload {
  sub: string; // 'subject', comúnmente usado para el username o ID
  id?: number | string; // A menudo el ID también está aquí
  // ... otras propiedades que pueda tener tu token (iat, exp, roles, etc.)
}

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // 1. Obtenemos el token, igual que antes
    const token = localStorage.getItem('token');

    // 2. Si no hay token, o la petición no es a nuestra API, la dejamos pasar sin modificar
    if (!token || !req.url.startsWith('/api')) {
      return next.handle(req);
    }

    // 3. --- NUEVA LÓGICA ---
    // Si hay token, intentamos decodificarlo para obtener el ID del usuario
    let userId: string | null = null;
    try {
      const decodedToken: JwtPayload = jwtDecode(token);
      // El backend de Spring Security a menudo pone el username en 'sub'.
      // Si pones el ID del usuario en el token, puede estar en una clave 'id' o 'userId'.
      // Asumiremos que el ID está en una clave 'id'. Si no, usa 'sub'.
      userId = decodedToken.id?.toString() || decodedToken.sub;
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      // Si el token es inválido, podríamos querer desloguear al usuario,
      // pero por ahora simplemente no añadiremos las cabeceras de ID.
    }

    // 4. Clonamos la petición para añadir TODAS las cabeceras
    if (userId) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`, // La cabecera original
          'X-Vendedor-ID': userId,           // Nueva cabecera para Ventas
          'X-Operario-ID': userId,           // Nueva cabecera para Producción/Mermas
          'X-Usuario-ID':  userId            // Nueva cabecera para Ajustes
        }
      });
      return next.handle(clonedRequest);
    }

    // 5. Si no pudimos obtener el userId, al menos enviamos el token de autorización
    const authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(authRequest);
  }
}
