import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter, Subject, takeUntil } from 'rxjs';

import { AuthService } from '@core/auth.service';
import { ThemeService } from '@core/theme.service';

// Interface para los enlaces de navegación
interface NavLink {
  path: string;
  label: string;
  icon: string;
  badge?: number; // Para futuros badges de notificación
}

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive
  ],
  animations: [
    // Animación para el fade del overlay
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 }))
      ])
    ]),
    // Animación para el slide del menú
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Estado del menú móvil
  isMenuOpen = false;

  // Enlaces de navegación
  navLinks: NavLink[] = [
    {
      path: '/productos',
      label: 'Productos',
      icon: 'inventory_2'
    },
    {
      path: '/producciones',
      label: 'Producción',
      icon: 'precision_manufacturing'
    },
    {
      path: '/mermas',
      label: 'Mermas',
      icon: 'recycling'
    },
    {
      path: '/ventas',
      label: 'Ventas',
      icon: 'point_of_sale'
    },
    {
      path: '/inventario/ajuste/nuevo',
      label: 'Ajuste de Stock',
      icon: 'rule'
    }
  ];

  // Servicios inyectados
  private auth = inject(AuthService);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  ngOnInit(): void {
    // Cerrar menú móvil cuando cambie la ruta
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closeMenu();
      });

    // Cerrar menú al presionar Escape
    this.setupKeyboardListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeKeyboardListeners();
  }

  /**
   * Alternar el estado del menú móvil
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Prevenir scroll del body cuando el menú está abierto
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Cerrar el menú móvil
   */
  closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  /**
   * Cerrar sesión
   */
  salir(): void {
    this.closeMenu();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  /**
   * TrackBy function para optimizar el ngFor
   */
  trackByPath(index: number, item: NavLink): string {
    return item.path;
  }

  /**
   * Configurar listeners de teclado
   */
  private setupKeyboardListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Remover listeners de teclado
   */
  private removeKeyboardListeners(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Manejar eventos de teclado
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.isMenuOpen) {
      this.closeMenu();
    }
  };

  /**
   * Obtener el ícono del tema actual
   */
  get themeIcon(): string {
    return this.themeService.isDark() ? 'light_mode' : 'dark_mode';
  }

  /**
   * Obtener el tooltip del tema actual
   */
  get themeTooltip(): string {
    return this.themeService.isDark() ? 'Activar modo claro' : 'Activar modo oscuro';
  }

  /**
   * Obtener el texto del tema para móvil
   */
  get themeText(): string {
    return this.themeService.isDark() ? 'Modo claro' : 'Modo oscuro';
  }

  /**
   * Verificar si es la ruta activa (útil para lógica adicional)
   */
  isActiveRoute(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  /**
   * Manejar errores de navegación
   */
  onNavigationError(error: any): void {
    console.error('Error de navegación:', error);
    // Aquí podrías mostrar un mensaje de error al usuario
  }
}
