import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const t = localStorage.getItem('token');
    return next.handle(
      t ? req.clone({ setHeaders: { Authorization: `Bearer ${t}` } }) : req
    );
  }
}
