// src/app/features/productos/product-list/product-list.component.ts

import { Component, OnInit, ViewChild, AfterViewInit, inject, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Imports de Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';

// Imports de Componentes y Servicios
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { ProductService } from '../product.service';
import { ProductoResponse } from '@core/models';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [
    CommonModule,
    RouterModule, // <-- 2. AÑADE RouterModule AQUÍ
    NavbarComponent, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule,
    MatDialogModule, MatSnackBarModule, MatTooltipModule, MatSlideToggleModule, MatChipsModule
  ]
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {
  // ... (el resto de tu clase no necesita cambios)
  dataSource = new MatTableDataSource<ProductoResponse>();
  isLoading = true;
  showInactive = false;

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private service = inject(ProductService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadProducts();
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(filterValue => {
      this.dataSource.filter = filterValue;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: ProductoResponse, filter: string) => {
      const dataStr = `${data.nombre} ${data.descripcion}`.toLowerCase();
      return dataStr.includes(filter);
    };
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  loadProducts() {
    this.isLoading = true;
    const productsObservable = this.showInactive
      ? this.service.listarTodos()
      : this.service.listarActivos();

    productsObservable.subscribe({
      next: (products) => {
        this.dataSource.data = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar la lista de productos.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue.trim().toLowerCase());
  }

  onNew() {
    this.router.navigate(['/productos', 'nuevo']);
  }

  onEdit(id: number) {
    this.router.navigate(['/productos', 'editar', id]);
  }

  onDeactivate(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar Desactivación', message: '¿Estás seguro de que quieres desactivar este producto? No se podrá vender, pero se mantendrá en el sistema.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.desactivar(id).subscribe({
          next: () => {
            this.snackBar.open('Producto desactivado con éxito', 'Cerrar', { duration: 3000, panelClass: ['snackbar-success'] });
            this.loadProducts();
          },
          error: (err) => {
            this.snackBar.open('Error al desactivar el producto.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
          }
        });
      }
    });
  }

  onActivate(id: number) {
    this.service.activar(id).subscribe({
      next: () => {
        this.snackBar.open('Producto activado con éxito', 'Cerrar', { duration: 3000, panelClass: ['snackbar-success'] });
        this.loadProducts();
      },
      error: (err) => {
        this.snackBar.open('Error al activar el producto.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      }
    });
  }

  toggleInactiveProducts() {
    this.showInactive = !this.showInactive;
    this.loadProducts();
  }
}
