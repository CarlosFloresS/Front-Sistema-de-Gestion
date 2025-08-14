import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  template: `
    <mat-toolbar class="navbar" color="secondary">
      <div class="nav-links">
        <a mat-button routerLink="/productos">Productos</a>
        <a mat-button routerLink="/producciones">Producción</a>
        <a mat-button routerLink="/mermas">Mermas</a>
        <a mat-button routerLink="/ventas">Ventas</a>
      </div>

      <span class="spacer"></span>

      <button
        mat-icon-button
        matTooltip="Cerrar sesión"
        aria-label="Salir"
        (click)="salir()"
        class="logout-btn"
      >
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styleUrls: ['./navbar.component.css'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink
  ]
})
export class NavbarComponent {
  constructor(private auth: AuthService, private router: Router) {}

  salir() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
