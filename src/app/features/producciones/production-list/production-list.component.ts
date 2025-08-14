// src/app/features/producciones/production-list/production-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe }   from '@angular/common';
import { RouterModule, Router }      from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map }                       from 'rxjs/operators';

import { MatTableModule }  from '@angular/material/table';
import { MatIconModule }   from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NavbarComponent }               from '../../../shared/navbar/navbar.component';
import { ProductionService, Produccion } from '../production.service';
import { ProductService }                from '../../productos/product.service';
import { Producto }                      from '../../../core/models';

interface ProduccionView extends Produccion {
  productName: string;
}

@Component({
  standalone: true,
  selector: 'app-production-list',
  template: `
    <app-navbar></app-navbar>

    <div class="toolbar" style="margin:16px 0;">
      <button mat-flat-button color="primary" (click)="onNew()">
        <mat-icon>add</mat-icon> Nueva Producción
      </button>
    </div>

    <table mat-table [dataSource]="(data$ | async) || []" class="mat-elevation-z8" style="width:100%">
      <!-- Producto -->
      <ng-container matColumnDef="producto">
        <th mat-header-cell *matHeaderCellDef>Producto</th>
        <td mat-cell       *matCellDef="let p">{{ p.productName }}</td>
      </ng-container>

      <!-- Fecha -->
      <ng-container matColumnDef="fecha">
        <th mat-header-cell *matHeaderCellDef>Fecha</th>
        <td mat-cell       *matCellDef="let p">{{ p.fecha | date }}</td>
      </ng-container>

      <!-- Cantidad -->
      <ng-container matColumnDef="cantidad">
        <th mat-header-cell *matHeaderCellDef>Cantidad</th>
        <td mat-cell       *matCellDef="let p">{{ p.cantidad }}</td>
      </ng-container>

      <!-- Acciones -->
      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell       *matCellDef="let p">
          <button mat-icon-button color="accent" (click)="onEdit(p.id!)">
            <mat-icon>edit</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row        *matRowDef="let row; columns: cols;"></tr>
    </table>
  `,
  styleUrls: ['./production-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    AsyncPipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    NavbarComponent
  ]
})
export class ProductionListComponent implements OnInit {
  cols = ['producto', 'fecha', 'cantidad', 'acciones'];
  data$!: Observable<ProduccionView[]>;

  private prodService    = inject(ProductionService);
  private productService = inject(ProductService);
  private router         = inject(Router);

  ngOnInit(): void {
    this.data$ = combineLatest([
      this.prodService.list(),
      this.productService.list()
    ]).pipe(
      map(([producciones, productos]) =>
        producciones.map(p => ({
          ...p,
          productName: productos.find(prod => prod.id === p.productoId)?.nombre ?? '—'
        }))
      )
    );
  }

  onNew(): void {
    this.router.navigate(['/producciones','nuevo']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/producciones','editar',id]);
  }
}
