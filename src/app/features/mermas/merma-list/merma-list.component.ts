// src/app/features/mermas/merma-list/merma-list.component.ts

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
import { MermaService } from '../merma.service';
import { MermaResponse } from '@core/models';

@Component({
  standalone: true,
  selector: 'app-merma-list',
  templateUrl: './merma-list.component.html',
  styleUrls: ['./merma-list.component.css'],
  imports: [
    CommonModule, RouterModule, NavbarComponent, MatTableModule, MatPaginatorModule,
    MatSortModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatFormFieldModule, MatInputModule
  ]
})
export class MermaListComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<MermaResponse>();
  isLoading = true;

  private service = inject(MermaService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadMermas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadMermas() {
    this.isLoading = true;
    this.service.listar().subscribe({
      next: (mermas) => {
        this.dataSource.data = mermas;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar la lista de mermas.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onNew() {
    this.router.navigate(['/mermas', 'nuevo']);
  }
}
