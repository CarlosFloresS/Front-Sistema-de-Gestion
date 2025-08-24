import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service'; // Asegúrate que la ruta a tu AuthService sea correcta

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtiene el rol esperado desde la data de la ruta
  const expectedRole = route.data['expectedRole'];

  // Verifica si el usuario está logueado y tiene el rol esperado
  if (!authService.isAuthenticated() || !authService.hasRole(expectedRole)) {
    // Si no cumple, redirige al login o a una página de acceso denegado
    router.navigate(['/login']);
    return false;
  }

  // Si cumple, permite el acceso
  return true;
};
