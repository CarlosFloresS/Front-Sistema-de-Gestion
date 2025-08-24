import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { finalize } from 'rxjs';

import { NavbarComponent } from '@shared/navbar/navbar.component';
import { UsuarioService } from '../usuario.service';
import { UsuarioResponse } from '@core/models/usuario.model';

@Component({
  standalone: true,
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
  imports: [
    CommonModule, RouterModule, NavbarComponent, MatTableModule, MatSnackBarModule,
    MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatSlideToggleModule, MatTooltipModule, MatChipsModule
  ]
})
export class UsuarioListComponent implements OnInit {
  isLoading = true;
  dataSource = new MatTableDataSource<UsuarioResponse>();
  displayedColumns: string[] = ['id', 'username', 'rol', 'estado', 'acciones'];

  private usuarioSvc = inject(UsuarioService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.usuarioSvc.listar().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (usuarios) => {
        this.dataSource.data = usuarios;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar la lista de usuarios.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onNew() {
    this.router.navigate(['/usuarios', 'nuevo']);
  }

  onEstadoChange(id: number, estado: boolean) {
    this.usuarioSvc.cambiarEstado(id, estado).subscribe({
      next: () => {
        this.snackBar.open('Estado del usuario actualizado.', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('Error al cambiar el estado.', 'Cerrar', { duration: 3000 });
        this.loadUsers(); // Recargamos para revertir el toggle visualmente en caso de error
      }
    });
  }
}
