import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.error = '';
    
    if (!this.username || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    
    this.authService.login(this.username, this.password).subscribe({
      next: (usuario) => {
        console.log("✅ Usuario autenticado:", usuario);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error("❌ Error en login:", err);
        this.loading = false;
        this.error = err.error?.error || 'Error al iniciar sesión';
      }
    });
  }
}