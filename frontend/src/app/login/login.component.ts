import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, FooterComponent]
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Si el usuario ya está logueado, redirigir a clientes
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/clientes']);
    }
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        this.isLoading = false;
        // Redirigir al usuario a la página principal después del login exitoso
        window.location.href = '/clientes';
      },
      error: (error) => {
        console.error('Error en el login', error);
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Credenciales inválidas';
        } else {
          this.errorMessage = error.error?.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.';
        }
      }
    });
  }
} 