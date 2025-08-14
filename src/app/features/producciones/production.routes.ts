// src/app/features/producciones/production.routes.ts
import { Routes }                   from '@angular/router';
import { AuthGuard }                from '../../core/auth.guard';
import { ProductionListComponent }  from './production-list/production-list.component';
import { ProductionFormComponent }  from './production-form/production-form.component';

export const PRODUCTION_ROUTES: Routes = [
  {
    path: '',
    component: ProductionListComponent,
    canActivate: [ AuthGuard ],
    pathMatch: 'full'
  },
  {
    path: 'nuevo',
    component: ProductionFormComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'editar/:id',
    component: ProductionFormComponent,
    canActivate: [ AuthGuard ]
  }
];
