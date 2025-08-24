// src/app/features/mermas/merma-form/merma-form.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// --- CAMBIO CLAVE: IMPORTS NECESARIOS PARA LA PLANTILLA ---
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
import { MermaService } from '../merma.service';
import { ProductoResponse, MermaRequest } from '@core/models';

@Component({
  standalone: true,
  selector: 'app-merma-form',
  templateUrl: './merma-form.component.html',
  styleUrls: ['./merma-form.component.css'],
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatIconModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class MermaFormComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  products$!: Observable<ProductoResponse[]>;

  private fb = inject(FormBuilder);
  private mermaService = inject(MermaService);
  private productSvc = inject(ProductService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.form = this.fb.group({
      productoId: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      motivo: ['', [Validators.required, Validators.maxLength(255)]]
    });
    this.products$ = this.productSvc.listarActivos();
  }

  submit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.form.disable();
    const request: MermaRequest = this.form.value;

    this.mermaService.registrar(request).pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.enable();
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Merma registrada con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/mermas']);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error al registrar la merma', 'Cerrar', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/mermas']);
  }
}
