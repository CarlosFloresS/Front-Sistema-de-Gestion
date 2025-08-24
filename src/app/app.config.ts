import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { AuthHeaderInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuración básica
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // Configuración para HttpClient y los interceptores
    provideHttpClient(withInterceptorsFromDi()),

    // Registramos nuestros interceptores. El orden puede ser importante.
    // 1. El JwtInterceptor se ejecuta primero para añadir el token.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    // 2. El AuthHeaderInterceptor se ejecuta después para añadir los headers X-
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    },

    // Si tienes otros interceptores (ej. para errores), añádelos aquí.
  ],
};
