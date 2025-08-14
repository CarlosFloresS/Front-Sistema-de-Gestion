// src/app/features/productos/product.routes.ts
import { Routes }               from '@angular/router';
import { AuthGuard }            from './../../core/auth.guard';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',                    // sólo exacto '/productos'
    pathMatch: 'full',           // ← aquí
    component: ProductListComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'nuevo',               // '/productos/nuevo'
    component: ProductFormComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'editar/:id',          // '/productos/editar/123'
    component: ProductFormComponent,
    canActivate: [ AuthGuard ]
  }
];
