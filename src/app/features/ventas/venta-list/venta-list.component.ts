// src/app/features/ventas/venta-list/venta-list.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NavbarComponent } from '@shared/navbar/navbar.component';
import { VentaService } from '../venta.service';
import { VentaResponse } from '@core/models';

export interface VentaAgrupada {
  fechaObj: Date;
  totalUnidades: number;
  totalVentaDia: number; // <-- CAMBIO: Añadido el total de venta del día
  transacciones: number;
  ventas: VentaResponse[];
}

@Component({
  standalone: true,
  selector: 'app-venta-list',
  templateUrl: './venta-list.component.html',
  styleUrls: ['./venta-list.component.css'],
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule, MatCardModule,
    MatDividerModule, MatButtonToggleModule, MatDatepickerModule, MatFormFieldModule,
    MatNativeDateModule, MatInputModule, MatTooltipModule
  ]
})
export class VentaListComponent implements OnInit {
  isLoading = true;

  private allVentas: VentaResponse[] = [];
  ventasFiltradas: VentaResponse[] = [];
  ventasAgrupadas: VentaAgrupada[] = [];

  range: FormGroup;

  // Estadísticas
  totalUnidadesVendidas = 0;
  ingresosTotales = 0; // <-- CAMBIO: Nueva estadística para el ingreso total
  productoMasVendido = 'N/A';

  private ventaSvc = inject(VentaService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.range = this.fb.group({
      start: [null],
      end: [null],
    });
  }

  ngOnInit() {
    this.loadVentas();
    this.range.valueChanges.subscribe(value => {
      if (value.start && value.end) {
        this.applyDateRangeFilter(value.start, value.end);
      }
    });
  }

  loadVentas() {
    this.isLoading = true;
    this.ventaSvc.listar().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (ventas: VentaResponse[]) => {
        this.allVentas = ventas;
        this.setFilter('today');
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error al cargar las ventas.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  processFilteredData() {
    this.ventasAgrupadas = this.groupVentasByDay(this.ventasFiltradas);
    this.calculateStats(this.ventasFiltradas);
  }

  setFilter(period: 'today' | 'month' | 'year') {
    const today = new Date();
    let start: Date;

    if (period === 'today') {
      start = new Date(today.setHours(0, 0, 0, 0));
    } else if (period === 'month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else { // year
      start = new Date(today.getFullYear(), 0, 1);
    }
    this.range.setValue({ start: start, end: new Date() }, { emitEvent: false });
    this.applyDateRangeFilter(start, new Date());
  }

  applyDateRangeFilter(start: Date, end: Date) {
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    this.ventasFiltradas = this.allVentas.filter(v => {
      const saleDate = new Date(v.fecha);
      return saleDate >= start && saleDate <= endDate;
    });
    this.processFilteredData();
  }

  clearFilter() {
    this.range.reset();
    this.ventasFiltradas = [...this.allVentas];
    this.processFilteredData();
  }

  calculateStats(ventas: VentaResponse[]) {
    if (ventas.length === 0) {
      this.totalUnidadesVendidas = 0;
      this.ingresosTotales = 0; // <-- CAMBIO: Reiniciar ingresos
      this.productoMasVendido = 'N/A';
      return;
    }

    this.totalUnidadesVendidas = ventas.reduce((sum, v) => sum + v.cantidad, 0);
    this.ingresosTotales = ventas.reduce((sum, v) => sum + v.totalVenta, 0); // <-- CAMBIO: Calcular ingresos totales

    const productCounts = ventas.reduce((acc, v) => {
      acc[v.productoNombre] = (acc[v.productoNombre] || 0) + v.cantidad;
      return acc;
    }, {} as { [key: string]: number });

    this.productoMasVendido = Object.keys(productCounts).reduce((a, b) => productCounts[a] > productCounts[b] ? a : b);
  }

  groupVentasByDay(ventas: VentaResponse[]): VentaAgrupada[] {
    const groupedMap = new Map<string, VentaAgrupada>();

    for (const venta of ventas) {
      const saleDateKey = new Date(venta.fecha).toDateString();

      if (!groupedMap.has(saleDateKey)) {
        groupedMap.set(saleDateKey, {
          fechaObj: new Date(venta.fecha),
          totalUnidades: 0,
          totalVentaDia: 0, // <-- CAMBIO: Inicializar en 0
          transacciones: 0,
          ventas: []
        });
      }

      const dia = groupedMap.get(saleDateKey)!;
      dia.totalUnidades += venta.cantidad;
      dia.totalVentaDia += venta.totalVenta; // <-- CAMBIO: Sumar el total de la venta al grupo del día
      dia.ventas.push(venta);
    }

    groupedMap.forEach(dia => dia.transacciones = dia.ventas.length);
    return Array.from(groupedMap.values()).sort((a, b) => b.fechaObj.getTime() - a.fechaObj.getTime());
  }

  onNew() {
    this.router.navigate(['/ventas', 'nuevo']);
  }
}
