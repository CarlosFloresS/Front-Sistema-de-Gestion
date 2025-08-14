// src/app/features/ventas/venta-list/venta-list.component.ts
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule }                          from '@angular/common';
import { RouterModule, Router }                 from '@angular/router';
import { Observable, combineLatest }            from 'rxjs';
import { map }                                  from 'rxjs/operators';
import { MatTableModule }       from '@angular/material/table';
import { MatPaginatorModule }   from '@angular/material/paginator';
import { MatSortModule }        from '@angular/material/sort';
import { MatInputModule }       from '@angular/material/input';
import { MatIconModule }        from '@angular/material/icon';
import { MatButtonModule }      from '@angular/material/button';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatCardModule }        from '@angular/material/card';

import { NavbarComponent }        from '../../../shared/navbar/navbar.component';
import { VentaService, Venta }    from '../venta.service';
import { ProductService }         from '../../productos/product.service';
import { Producto }               from '../../../core/models';
import { MatPaginator }           from '@angular/material/paginator';
import { MatSort, Sort }          from '@angular/material/sort';
import { MatTableDataSource }     from '@angular/material/table';

interface VentaView extends Venta {
  productName: string;
}

@Component({
  standalone: true,
  selector: 'app-venta-list',
  template: `
    <app-navbar></app-navbar>
    <mat-card class="m-4 p-4">
      <div class="header">
        <h2>Ventas</h2>
        <button mat-flat-button color="primary" (click)="onNuevo()">
          <mat-icon>add</mat-icon> Nueva Venta
        </button>
      </div>
      <p>Total unidades vendidas: {{ totalVentas }}</p>

      <mat-form-field appearance="outline" class="w-full mb-4">
        <mat-label>Buscar producto</mat-label>
        <input matInput (keyup)="applyFilter($any($event.target).value)" placeholder="Filtrar">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8 w-full">
        <!-- Producto -->
        <ng-container matColumnDef="producto">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Producto</th>
          <td mat-cell *matCellDef="let v">{{ v.productName }}</td>
        </ng-container>
        <!-- Fecha -->
        <ng-container matColumnDef="fecha">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha</th>
          <td mat-cell *matCellDef="let v">{{ v.fecha | date:'shortDate' }}</td>
        </ng-container>
        <!-- Cantidad -->
        <ng-container matColumnDef="cantidad">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Cantidad</th>
          <td mat-cell *matCellDef="let v">{{ v.cantidad }}</td>
        </ng-container>
        <!-- Acciones -->
        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let v">
            <button mat-icon-button color="accent" (click)="onEditar(v.id!)">
              <mat-icon>edit</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedCols"></tr>
        <tr mat-row        *matRowDef="let row; columns: displayedCols;"></tr>
      </table>

      <mat-paginator [length]="dataSource.data.length"
                     [pageSize]="5"
                     [pageSizeOptions]="[5, 10, 20]">
      </mat-paginator>
    </mat-card>
  `,
  styleUrls: ['./venta-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NavbarComponent
  ]
})
export class VentaListComponent implements OnInit {
  displayedCols = ['producto','fecha','cantidad','acciones'];
  dataSource = new MatTableDataSource<VentaView>([]);
  totalVentas = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)      sort!: MatSort;

  private ventaSvc    = inject(VentaService);
  private productSvc  = inject(ProductService);
  private router      = inject(Router);

  ngOnInit(): void {
    combineLatest([
      this.ventaSvc.list(),
      this.productSvc.list()
    ]).pipe(
      map(([ventas, productos]) =>
        ventas.map(v => ({
          ...v,
          productName: productos.find(p => p.id === v.productoId)?.nombre ?? '—'
        }))
      )
    ).subscribe(data => {
      this.dataSource.data = data;
      this.totalVentas = data.reduce((sum, v) => sum + v.cantidad, 0);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  onNuevo() {
    this.router.navigate(['/ventas','nuevo']);
  }

  onEditar(id: number) {
    this.router.navigate(['/ventas','editar',id]);
  }
}
