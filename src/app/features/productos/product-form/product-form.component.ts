// src/app/features/productos/product-form/product-form.component.ts
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

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';

import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ProductService }  from '../product.service';
import { Producto }        from '../../../core/models';

@Component({
  standalone: true,
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NavbarComponent
  ]
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  private id?: number;

  private fb      = inject(FormBuilder);
  private service = inject(ProductService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      stock:  [0, [Validators.required, Validators.min(0)]]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.id     = +params['id'];
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
    const producto: Producto = this.form.value;
    const call$ = this.isEdit && this.id
      ? this.service.update(this.id, producto)
      : this.service.create(producto);

    call$.subscribe(() => this.router.navigate(['/productos']));
  }

  cancel(): void {
    this.router.navigate(['/productos']);
  }
}
