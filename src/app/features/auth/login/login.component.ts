import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule }   from '@angular/material/card';
import { MatInputModule }  from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService }     from '../../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, MatCardModule, MatInputModule, MatButtonModule]
})
export class LoginComponent  {
  username = ''; password = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/productos']),
      error: () => alert('Credenciales inválidas')
    });
  }
}
