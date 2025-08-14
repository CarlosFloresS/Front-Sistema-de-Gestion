import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private router: Router) {}
  canActivate: CanActivateFn = () => {
    if (localStorage.getItem('token')) return true;
    this.router.navigate(['/login']);
    return false;
  };
}
