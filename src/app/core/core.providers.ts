import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor }   from './jwt.interceptor';

export const CORE_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
];
