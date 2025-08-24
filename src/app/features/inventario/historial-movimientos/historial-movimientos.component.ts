import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize, switchMap } from 'rxjs';

// Material Imports
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

import { InventarioService } from '../inventario.service';
import { ProductService } from '../../productos/product.service';
import { MovimientoInventarioResponse, ProductoResponse } from '@core/models';
import { NavbarComponent } from '@shared/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-historial-movimientos',
  templateUrl: './historial-movimientos.component.html',
  styleUrls: ['./historial-movimientos.component.css'],
  imports: [
    CommonModule, RouterModule, NavbarComponent, MatTableModule, MatProgressSpinnerModule,
    MatIconModule, MatButtonModule, MatChipsModule, MatCardModule
  ]
})
export class HistorialMovimientosComponent implements OnInit {
  isLoading = true;
  producto: ProductoResponse | null = null;

  dataSource = new MatTableDataSource<MovimientoInventarioResponse>();
  displayedColumns: string[] = ['fecha', 'tipo', 'cantidad', 'stockResultante', 'origen', 'motivo'];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inventarioService = inject(InventarioService);
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    const productoId = this.route.snapshot.paramMap.get('productoId');

    if (productoId) {
      // Usamos switchMap para encadenar las llamadas: primero obtenemos los detalles del producto,
      // luego su historial de movimientos.
      this.productService.getById(+productoId).pipe(
        switchMap(prod => {
          this.producto = prod;
          return this.inventarioService.getHistorialDeMovimientos(+productoId);
        }),
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (movimientos) => {
          this.dataSource.data = movimientos;
        },
        error: (err) => {
          this.snackBar.open('Error al cargar el historial del producto.', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/productos']);
        }
      });
    } else {
      this.router.navigate(['/productos']);
    }
  }

  goBack(): void {
    this.router.navigate(['/productos']);
  }
}
