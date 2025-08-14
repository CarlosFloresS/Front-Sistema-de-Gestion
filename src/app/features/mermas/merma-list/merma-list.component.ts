import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe }   from '@angular/common';
import { RouterModule, Router }      from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map }                       from 'rxjs/operators';

import { MatTableModule }  from '@angular/material/table';
import { MatIconModule }   from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NavbarComponent }           from '../../../shared/navbar/navbar.component';
import { MermaService, Merma }       from '../merma.service';
import { ProductService }            from '../../productos/product.service';
import { Producto }                  from '../../../core/models';

interface MermaView extends Merma {
  productName: string;
}

@Component({
  standalone: true,
  selector: 'app-merma-list',
  template: `
    <app-navbar></app-navbar>

    <div class="toolbar" style="margin:16px 0;">
      <button mat-flat-button color="primary" (click)="onNew()">
        <mat-icon>add</mat-icon> Nueva Merma
      </button>
    </div>

    <table mat-table [dataSource]="(data$ | async) || []" class="mat-elevation-z8" style="width:100%">
      <!-- Producto -->
      <ng-container matColumnDef="producto">
        <th mat-header-cell *matHeaderCellDef>Producto</th>
        <td mat-cell *matCellDef="let m">{{ m.productName }}</td>
      </ng-container>

      <!-- Fecha -->
      <ng-container matColumnDef="fecha">
        <th mat-header-cell *matHeaderCellDef>Fecha</th>
        <td mat-cell *matCellDef="let m">{{ m.fecha | date }}</td>
      </ng-container>

      <!-- Cantidad -->
      <ng-container matColumnDef="cantidad">
        <th mat-header-cell *matHeaderCellDef>Cantidad</th>
        <td mat-cell *matCellDef="let m">{{ m.cantidad }}</td>
      </ng-container>

      <!-- Motivo -->
      <ng-container matColumnDef="motivo">
        <th mat-header-cell *matHeaderCellDef>Motivo</th>
        <td mat-cell *matCellDef="let m">{{ m.motivo }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row        *matRowDef="let row; columns: cols;"></tr>
    </table>
  `,
  styleUrls: ['./merma-list.component.scss'],
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
export class MermaListComponent implements OnInit {
  cols = ['producto','fecha','cantidad','motivo'];
  data$!: Observable<MermaView[]>;

  private mermaService   = inject(MermaService);
  private productService = inject(ProductService);
  private router         = inject(Router);

  ngOnInit(): void {
    this.data$ = combineLatest([
      this.mermaService.list(),
      this.productService.list()
    ]).pipe(
      map(([mermas, productos]) =>
        mermas.map(m => ({
          ...m,
          productName: productos.find(p => p.id === m.productoId)?.nombre ?? '—'
        }))
      )
    );
  }

  onNew(): void {
    this.router.navigate(['/mermas','nuevo']);
  }
}
