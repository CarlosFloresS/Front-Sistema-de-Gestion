// src/app/features/producciones/production-form/production-form.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NavbarComponent } from '@shared/navbar/navbar.component';
import { ProductService } from '../../productos/product.service';
import { ProduccionService } from '../production.service'; // Asegúrate que el nombre de archivo es 'production.service.ts'
import { ProductoResponse, ProduccionRequest } from '@core/models';

@Component({
  standalone: true,
  selector: 'app-production-form',
  templateUrl: './production-form.component.html',
  styleUrls: ['./production-form.component.css'],
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatIconModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class ProductionFormComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  products$!: Observable<ProductoResponse[]>;

  private fb = inject(FormBuilder);
  private produccionService = inject(ProduccionService);
  private prodSvc = inject(ProductService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.form = this.fb.group({
      productoId: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
    this.products$ = this.prodSvc.listarActivos();
  }

  submit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.form.disable();
    const request: ProduccionRequest = this.form.value;

    this.produccionService.registrar(request).pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.enable();
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Producción registrada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/producciones']);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error al registrar la producción', 'Cerrar', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/producciones']);
  }
}
