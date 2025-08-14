import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter }        from '@angular/router';
import { provideAnimations }    from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent }   from './app/app.component';
import { routes }         from './app/app.routes';
import { CORE_PROVIDERS } from './app/core/core.providers';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    ...CORE_PROVIDERS
  ]
}).catch(err => console.error(err));
