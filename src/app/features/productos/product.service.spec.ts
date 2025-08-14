import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable }  from 'rxjs';
import { Producto }    from '../../core/models';   // interfaz creada antes

@Injectable({ providedIn: 'root' })
export class ProductService {

  private api = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {}

  list(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.api);
  }

  create(p: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.api, p);
  }

  /* agrega update, delete si los necesitas */
}
