import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { RouterModule, Router }       from '@angular/router';

import { MatCardModule }              from '@angular/material/card';
import { MatFormFieldModule }         from '@angular/material/form-field';
import { MatInputModule }             from '@angular/material/input';
import { MatAutocompleteModule }      from '@angular/material/autocomplete';
import { MatButtonModule }            from '@angular/material/button';

import { NavbarComponent }            from '../../../shared/navbar/navbar.component';
import { VentaService, CreateVenta }  from '../venta.service';
import { ProductService }             from '../../productos/product.service';
import { Producto }                   from '../../../core/models';

import { Observable, startWith, map } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  standalone: true,
  selector: 'app-venta-form',
  templateUrl: './venta-form.component.html',
  styleUrls: ['./venta-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    NavbarComponent
  ]
})
export class VentaFormComponent implements OnInit {
  form!: FormGroup;
  allProducts: Producto[] = [];
  filteredProducts$!: Observable<Producto[]>;

  private fb      = inject(FormBuilder);
  private ventaSvc= inject(VentaService);
  private prodSvc = inject(ProductService);
  private router  = inject(Router);

  ngOnInit(): void {
    // 1) Initialize form
    this.form = this.fb.group({
      producto: [null as Producto | null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1), this.stockValidator.bind(this)]]
    });

    // 2) Load only products with stock > 0
    this.prodSvc.list().subscribe(list => {
      this.allProducts = list.filter(p => p.stock > 0);

      // 3) Set up the autocomplete filter
      this.filteredProducts$ = this.form
        .get('producto')!
        .valueChanges
        .pipe(
          startWith<Producto | string>(''),
          map(val => typeof val === 'string' ? val : val?.nombre || ''),
          map(name =>
            this.allProducts.filter(p =>
              p.nombre.toLowerCase().includes(name.toLowerCase())
            )
          )
        );
    });
  }

  /** Mostrar nombre (y stock) en el input cuando el value es un Producto */
  displayFn(prod?: Producto): string {
    return prod ? `${prod.nombre} (Disp: ${prod.stock})` : '';
  }

  /** Al seleccionar del dropdown parcheamos el control y revalidamos cantidad */
  onProductSelected(event: MatAutocompleteSelectedEvent) {
    const prod: Producto = event.option.value;
    this.form.patchValue({ producto: prod });
    this.form.get('cantidad')!.updateValueAndValidity();
  }

  /** Validator que impide cantidad > stock */
  private stockValidator(ctrl: AbstractControl): ValidationErrors | null {
    const prod: Producto = this.form?.get('producto')?.value;
    if (prod && ctrl.value > prod.stock) {
      return { exceedStock: true };
    }
    return null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const prod: Producto = this.form.value.producto;
    const cantidad: number = this.form.value.cantidad;

    const dto: CreateVenta = {
      productoId: prod.id!,
      cantidad
    };

    this.ventaSvc.create(dto).subscribe({
      next: () => this.router.navigate(['/ventas']),
      error: err => alert('Error al registrar venta: ' + err.statusText)
    });
  }

  cancel(): void {
    this.router.navigate(['/ventas']);
  }
}
