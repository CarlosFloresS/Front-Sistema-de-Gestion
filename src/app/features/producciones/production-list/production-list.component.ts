// src/app/features/producciones/production-list/production-list.component.ts

import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NavbarComponent } from '@shared/navbar/navbar.component';
import { ProduccionService } from '../production.service'; // Asegúrate que el nombre de archivo es 'production.service.ts'
import { ProduccionResponse } from '@core/models';

@Component({
  standalone: true,
  selector: 'app-production-list',
  templateUrl: './production-list.component.html',
  styleUrls: ['./production-list.component.css'],
  imports: [
    CommonModule, RouterModule, NavbarComponent, MatTableModule, MatPaginatorModule,
    MatSortModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatFormFieldModule, MatInputModule
  ]
})
export class ProductionListComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<ProduccionResponse>();
  isLoading = true;

  private service = inject(ProduccionService);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadProducciones();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducciones() {
    this.isLoading = true;
    this.service.listar().subscribe(data => {
      this.dataSource.data = data;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onNew() {
    this.router.navigate(['/producciones', 'nuevo']);
  }
}
