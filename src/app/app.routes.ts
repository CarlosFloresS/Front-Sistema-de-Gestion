// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'productos',
    loadChildren: () =>
      import('./features/productos/product.routes').then(m => m.PRODUCT_ROUTES)
  },
  {
    path: 'producciones',
    loadChildren: () =>
      import('./features/producciones/production.routes').then(m => m.PRODUCTION_ROUTES)
  },
  {
    path: 'mermas',
    loadChildren: () =>
      import('./features/mermas/merma.routes').then(m => m.MERMA_ROUTES)
  },
  {
    path: 'ventas',
    loadChildren: () =>
      import('./features/ventas/venta.routes').then(m => m.VENTA_ROUTES)
  },

  // --- INICIO DE NUEVAS RUTAS DE INVENTARIO ---
  // Estas rutas usan `loadComponent` porque los componentes de inventario son `standalone`.
  // Es la forma moderna de hacer lazy-loading para un único componente.
  {
    path: 'inventario/historial/:productoId', // Ruta para ver el historial de un producto específico.
    loadComponent: () =>
      import('./features/inventario/historial-movimientos/historial-movimientos.component')
      .then(m => m.HistorialMovimientosComponent)
    // NOTA: Aquí podrías añadir un `canActivate` guard para proteger la ruta
    // canActivate: [AuthGuard]
  },
  {
    path: 'inventario/ajuste/nuevo', // Ruta para el formulario de ajuste manual.
    loadComponent: () =>
      import('./features/inventario/ajuste-inventario-form/ajuste-inventario-form.component')
      .then(m => m.AjusteInventarioFormComponent)
    // NOTA: Esta ruta debería estar protegida para que solo administradores puedan acceder.
    // canActivate: [AuthGuard, AdminGuard]
  },
  // --- FIN DE NUEVAS RUTAS DE INVENTARIO ---

  // Ruta por defecto si el usuario ya está en la aplicación.
  { path: '', redirectTo: '/productos', pathMatch: 'full' },

  // Ruta comodín para cualquier URL no encontrada.
  { path: '**', redirectTo: '/productos' } // O a una página 404 dedicada
];
