import { Component, OnInit, inject } from '@angular/core';
import { Router }         from '@angular/router';
import { AsyncPipe }      from '@angular/common';
import { Observable }     from 'rxjs';

import { MatTableModule }  from '@angular/material/table';
import { MatIconModule }   from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ProductService }  from '../product.service';
import { Producto }        from '../../../core/models';

@Component({
  standalone: true,
  selector: 'app-product-list',
  template: `
    <app-navbar></app-navbar>
    <div class="toolbar" style="margin:16px 0;">
      <button mat-flat-button color="primary" (click)="onNew()">
        <mat-icon>add</mat-icon> Nuevo Producto
      </button>
    </div>

    <table mat-table [dataSource]="(data$ | async) || []" class="mat-elevation-z8" style="width:100%">

      <ng-container matColumnDef="nombre">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell       *matCellDef="let p">{{ p.nombre }}</td>
      </ng-container>

      <ng-container matColumnDef="stock">
        <th mat-header-cell *matHeaderCellDef>Stock</th>
        <td mat-cell       *matCellDef="let p">{{ p.stock }}</td>
      </ng-container>

      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell       *matCellDef="let p">
          <button mat-icon-button (click)="onEdit(p.id)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="onDelete(p.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row        *matRowDef="let row; columns: cols;"></tr>
    </table>
  `,
  styleUrls: ['./product-list.component.scss'],
  imports: [
    NavbarComponent,
    AsyncPipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class ProductListComponent implements OnInit {
  cols = ['nombre', 'stock', 'acciones'];
  data$!: Observable<Producto[]>;

  private service = inject(ProductService);
  private router  = inject(Router);

  ngOnInit() {
    this.data$ = this.service.list();
  }

  onNew() {
    this.router.navigate(['/productos','nuevo']);
  }

  onEdit(id: number) {
    this.router.navigate(['/productos','editar',id]);
  }

  onDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    this.service.delete(id).subscribe(() => {
      // recarga la lista tras eliminar
      this.data$ = this.service.list();
    });
  }
}
