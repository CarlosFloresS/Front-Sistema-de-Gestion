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
  Router
} from '@angular/router';

import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule }     from '@angular/material/select';
import { MatButtonModule }     from '@angular/material/button';

import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { MermaService, Merma }    from '../merma.service';
import { ProductService }         from '../../productos/product.service';
import { Producto }               from '../../../core/models';
import { Observable }             from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-merma-form',
  templateUrl: './merma-form.component.html',
  styleUrls: ['./merma-form.component.scss'],
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

    NavbarComponent,
  ]
})
export class MermaFormComponent implements OnInit {
  form!: FormGroup;
  products$!: Observable<Producto[]>;

  private fb           = inject(FormBuilder);
  private mermaService = inject(MermaService);
  private productSvc   = inject(ProductService);
  private router       = inject(Router);

  ngOnInit(): void {
    // Carga productos
    this.products$ = this.productSvc.list();

    // Construye el formulario
    this.form = this.fb.group({
      productoId: [null, Validators.required],
      fecha:      [new Date(), Validators.required],
      cantidad:   [0, [Validators.required, Validators.min(1)]],
      motivo:     ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const dto: Merma = {
      productoId: raw.productoId,
      fecha:      (raw.fecha as Date).toISOString(),
      cantidad:   raw.cantidad,
      motivo:     raw.motivo
    };

    this.mermaService.create(dto)
      .subscribe(() => this.router.navigate(['/mermas']));
  }

  cancel(): void {
    this.router.navigate(['/mermas']);
  }
}
