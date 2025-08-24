import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize, Observable, startWith, map, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

// Componentes y Servicios
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { ProductService } from '../../productos/product.service';
import { VentaService } from '../venta.service';
import { ProductoResponse, VentaRequest, VentaResponse } from '@core/models';

// Validador personalizado para asegurar que se selecciona un objeto
export function requireMatchObject(control: AbstractControl): { [key: string]: any } | null {
  const value = control.value;
  if (value && typeof value === 'string') {
    return { requireMatch: true };
  }
  return null;
}

// Validador personalizado para el stock
function stockValidator(control: AbstractControl): { [key: string]: any } | null {
  const cantidad = control.get('cantidad')?.value;
  const producto = control.get('producto')?.value as ProductoResponse;
  if (producto && cantidad > producto.stock) {
    return { exceedStock: { available: producto.stock } };
  }
  return null;
}

@Component({
  standalone: true,
  selector: 'app-venta-form',
  templateUrl: './venta-form.component.html',
  styleUrls: ['./venta-form.component.css'],
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatIconModule, MatAutocompleteModule, MatTableModule,
    MatTooltipModule, MatCardModule
  ],
  animations: [
    trigger('rowsAnimation', [
      transition('void => *', [
        style({ height: '0', opacity: '0', transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ height: '*', opacity: '1', transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class VentaFormComponent implements OnInit {
  ventaForm!: FormGroup;
  itemForm!: FormGroup;
  isLoading = false;

  allProducts: ProductoResponse[] = [];
  filteredProducts$!: Observable<ProductoResponse[]>;

  dataSource = new MatTableDataSource<AbstractControl>();
  displayedColumns: string[] = ['producto', 'cantidad', 'precio', 'subtotal', 'acciones'];

  private fb = inject(FormBuilder);
  private ventaService = inject(VentaService);
  private productSvc = inject(ProductService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.ventaForm = this.fb.group({
      detalles: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });

    this.itemForm = this.fb.group({
      producto: [null, [Validators.required, requireMatchObject]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    }, { validators: stockValidator });

    this.productSvc.listarActivos().subscribe(prods => {
      this.allProducts = prods.filter(p => p.stock > 0);
      this.filteredProducts$ = this.itemForm.get('producto')!.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value?.nombre)),
        map(name => (name ? this._filter(name) : this.allProducts.slice()))
      );
    });

    this.detalles.valueChanges.subscribe(() => {
      this.dataSource.data = this.detalles.controls;
    });
  }

  get detalles(): FormArray {
    return this.ventaForm.get('detalles') as FormArray;
  }

  get totalVenta(): number {
    return this.detalles.controls
      .reduce((acc, control) => acc + (control.value.producto.precio * control.value.cantidad), 0);
  }

  private _filter(value: string): ProductoResponse[] {
    const filterValue = value.toLowerCase();
    return this.allProducts.filter(prod => prod.nombre.toLowerCase().includes(filterValue));
  }

  displayFn(product: ProductoResponse): string {
    return product?.nombre ?? '';
  }

  addItem(): void {
    if (this.itemForm.invalid) {
        this.itemForm.markAllAsTouched();
        return;
    }

    const productoSeleccionado = this.itemForm.value.producto as ProductoResponse;
    if (typeof productoSeleccionado !== 'object' || productoSeleccionado === null) {
      this.snackBar.open('Por favor, selecciona un producto válido de la lista.', 'Cerrar', { duration: 3000 });
      return;
    }
    const cantidadAAgregar = this.itemForm.value.cantidad;

    const itemExistente = this.detalles.controls.find(
      control => control.value.producto.id === productoSeleccionado.id
    );

    if (itemExistente) {
      const cantidadActual = itemExistente.value.cantidad;
      const nuevaCantidad = cantidadActual + cantidadAAgregar;

      if (nuevaCantidad > productoSeleccionado.stock) {
        this.snackBar.open(
          `Stock insuficiente. Disponibles: ${productoSeleccionado.stock}, en carrito: ${cantidadActual}.`,
          'Cerrar', { duration: 4000 }
        );
        return;
      }

      itemExistente.get('cantidad')?.setValue(nuevaCantidad);
      this.snackBar.open(`Cantidad de "${productoSeleccionado.nombre}" actualizada`, 'Cerrar', { duration: 2000 });
    } else {
      const nuevoDetalle = this.fb.group({
        producto: [productoSeleccionado, Validators.required],
        cantidad: [cantidadAAgregar, Validators.required]
      });
      this.detalles.push(nuevoDetalle);
    }

    this.itemForm.reset({ cantidad: 1 });
    this.itemForm.get('producto')?.setValue('');
  }

  removeItem(index: number): void {
    this.detalles.removeAt(index);
  }

  submit(): void {
    if (this.ventaForm.invalid) {
        this.ventaForm.markAllAsTouched();
        return;
    }

    this.isLoading = true;
    this.ventaForm.disable();

    const itemsParaVender = this.detalles.getRawValue();

    const requests: Observable<VentaResponse>[] = itemsParaVender.map((item: any) => {
      const ventaRequest: VentaRequest = {
        productoId: item.producto.id,
        cantidad: item.cantidad
      };
      return this.ventaService.registrar(ventaRequest);
    });

    forkJoin(requests).pipe(
      finalize(() => {
        this.isLoading = false;
        this.ventaForm.enable();
      })
    ).subscribe({
      next: (responses) => {
        this.snackBar.open(`${responses.length} tipo(s) de producto(s) vendidos con éxito`, 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/ventas']);
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = err.error?.message || 'Una de las ventas falló. Revisa el stock y vuelve a intentarlo.';
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/ventas']);
  }
}
