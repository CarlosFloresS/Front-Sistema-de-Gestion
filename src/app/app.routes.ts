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

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
