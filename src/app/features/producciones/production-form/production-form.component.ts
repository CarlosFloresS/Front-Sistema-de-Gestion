// src/app/features/producciones/production-form/production-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  RouterModule,
  ActivatedRoute,
  Router
} from '@angular/router';

import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule }     from '@angular/material/select';
import { MatButtonModule }     from '@angular/material/button';

import { NavbarComponent }      from '../../../shared/navbar/navbar.component';
import { ProductionService, Produccion } from '../production.service';
import { ProductService }       from '../../productos/product.service';
import { Producto }             from '../../../core/models';
import { Observable }           from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-production-form',
  templateUrl: './production-form.component.html',
  styleUrls: ['./production-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    NavbarComponent
  ]
})
export class ProductionFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  private id?: number;
  products$!: Observable<Producto[]>;

  private fb      = inject(FormBuilder);
  private service = inject(ProductionService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private prodSvc = inject(ProductService);

  ngOnInit(): void {
    // 1. Cargar productos para el selector
    this.products$ = this.prodSvc.list();

    // 2. Construir formulario
    this.form = this.fb.group({
      productoId: [null, Validators.required],
      fecha:      [new Date(), Validators.required],
      cantidad:   [0, [Validators.required, Validators.min(1)]]
    });

    // 3. Si viene :id, cargamos para editar
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.id     = +params['id'];
        this.service.getById(this.id).subscribe((dto: Produccion) => {
          this.form.patchValue({
            productoId: dto.productoId,
            fecha:      new Date(dto.fecha),
            cantidad:   dto.cantidad
          });
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.value;
    const dto: Produccion = {
      productoId: raw.productoId,
      fecha:      (raw.fecha as Date).toISOString(),
      cantidad:   raw.cantidad
    };
    const call$ = this.isEdit && this.id
      ? this.service.update(this.id, dto)
      : this.service.create(dto);
    call$.subscribe(() => this.router.navigate(['/producciones']));
  }

  cancel(): void {
    this.router.navigate(['/producciones']);
  }
}
