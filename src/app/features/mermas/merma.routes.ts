import { Routes }               from '@angular/router';
import { AuthGuard }            from '../../core/auth.guard';
import { MermaListComponent }   from './merma-list/merma-list.component';
import { MermaFormComponent }   from './merma-form/merma-form.component';

export const MERMA_ROUTES: Routes = [
  {
    path: '',
    component: MermaListComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: 'nuevo',
    component: MermaFormComponent,
    canActivate: [AuthGuard]
  }
];
