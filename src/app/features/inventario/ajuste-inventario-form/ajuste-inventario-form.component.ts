// src/app/features/inventario/ajuste-inventario-form/ajuste-inventario-form.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

// Componentes y Servicios
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { InventarioService } from '../inventario.service';
import { ProductService } from '../../productos/product.service';
import { ProductoResponse, AjusteInventarioRequest } from '@core/models';

@Component({
  standalone: true,
  selector: 'app-ajuste-inventario-form',
  templateUrl: './ajuste-inventario-form.component.html',
  styleUrls: ['./ajuste-inventario-form.component.css'],
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule,
    MatIconModule, MatSelectModule, MatCardModule
  ]
})
export class AjusteInventarioFormComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  products$!: Observable<ProductoResponse[]>;

  private fb = inject(FormBuilder);
  private inventarioService = inject(InventarioService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.form = this.fb.group({
      productoId: [null, [Validators.required]],
      // --- CORRECCIÓN APLICADA AQUÍ ---
      // Se añade el tipo 'AbstractControl' al parámetro del validador personalizado.
      cantidadAjuste: [0, [Validators.required, (control: AbstractControl) => control.value === 0 ? { 'zero': true } : null]],
      motivo: ['', [Validators.required, Validators.maxLength(255)]]
    });

    // Listamos todos los productos (incluyendo inactivos) para posibles ajustes.
    this.products$ = this.productService.listarTodos();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.form.disable();
    const request: AjusteInventarioRequest = this.form.value;

    this.inventarioService.registrarAjuste(request).pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.enable();
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Ajuste de inventario registrado con éxito.', 'Cerrar', { duration: 3000 });
        // Redirigimos al historial del producto ajustado para ver el resultado
        this.router.navigate(['/inventario/historial', request.productoId]);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err.error?.message || 'Error al registrar el ajuste.', 'Cerrar', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/productos']);
  }
}
