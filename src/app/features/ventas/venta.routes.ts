import { Routes }           from '@angular/router';
import { AuthGuard }        from '../../core/auth.guard';
import { VentaListComponent } from './venta-list/venta-list.component';
import { VentaFormComponent } from './venta-form/venta-form.component';

export const VENTA_ROUTES: Routes = [
  { path: '', component: VentaListComponent, canActivate: [AuthGuard] },
  { path: 'nuevo', component: VentaFormComponent, canActivate: [AuthGuard] }
];
