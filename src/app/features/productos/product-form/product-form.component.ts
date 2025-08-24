import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

// Imports de Angular Material (sin cambios)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

// Imports de Componentes y Servicios (sin cambios)
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { ProductService } from '../product.service';
// CAMBIO: Importamos los nuevos modelos
import { ProductoRequest, ProductoResponse } from '@core/models/producto.model';

@Component({
  standalone: true,
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, NgIf,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatIconModule, NavbarComponent
  ]
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  isLoading = false;
  private id?: number;

  private fb = inject(FormBuilder);
  private service = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    // CAMBIO: Actualizamos el FormGroup para que coincida con ProductoRequestDto
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(80)]],
      descripcion: ['', [Validators.maxLength(255)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      costo: [0, [Validators.required, Validators.min(0)]]
      // El campo 'stock' se ha eliminado del formulario.
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.id = +params['id'];
        // El servicio ahora devuelve ProductoResponse, pero patchValue funciona igual
        // porque solo rellena los campos que coinciden en el formulario.
        this.service.getById(this.id).subscribe(prod => {
          this.form.patchValue(prod);
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.form.disable();

    // CAMBIO: El valor del formulario ahora es directamente el payload del request.
    const requestPayload: ProductoRequest = this.form.value;

    // CAMBIO: Usamos los nuevos métodos del servicio.
    const call$ = this.isEdit && this.id
      ? this.service.actualizar(this.id, requestPayload)
      : this.service.registrar(requestPayload);

    call$.pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.enable();
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Producto guardado con éxito', 'Cerrar', {
          duration: 3000, panelClass: ['snackbar-success']
        });
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        // CAMBIO: Mensaje de error más específico si es posible.
        const errorMessage = err.error?.message || 'Error al guardar el producto';
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000, panelClass: ['snackbar-error']
        });
        console.error('Error al guardar:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/productos']);
  }
}
