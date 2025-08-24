import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo intercepta las llamadas a nuestra API, no a otras URLs
    if (!req.url.startsWith('/api/')) {
        return next.handle(req);
    }

    const userId = this.authService.getUserId();

    if (userId) {
      let headers = req.headers;

      // Lógica para añadir las cabeceras específicas
      if (req.method === 'POST') {
          if (req.url.includes('/api/producciones') || req.url.includes('/api/mermas')) {
            headers = headers.set('X-Operario-ID', userId.toString());
          } else if (req.url.includes('/api/ventas')) {
            headers = headers.set('X-Vendedor-ID', userId.toString());
          } else if (req.url.includes('/api/inventario/ajustes')) {
            headers = headers.set('X-Usuario-ID', userId.toString());
          }
      }

      const clonedReq = req.clone({ headers });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
