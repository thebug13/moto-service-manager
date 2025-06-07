import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface User {
  id: number;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario es administrador
    const userRole = this.authService.getUserRole();
    if (userRole !== 'Administrador') {
      this.router.navigate(['/productos']);
      return;
    }

    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.error = 'Error al cargar usuarios. Por favor, intente nuevamente.';
        this.isLoading = false;
        
        // Si el error es 401, redirigir al login
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  updateUserRole(userId: number, event: Event): void {
    const newRole = (event.target as HTMLSelectElement).value;

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    this.apiService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        this.successMessage = 'Rol actualizado correctamente';
        this.loadUsers(); // Recargar la lista de usuarios
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al actualizar rol:', error);
        this.error = 'Error al actualizar el rol. Por favor, intente nuevamente.';
        this.isLoading = false;
        
        // Si el error es 401, redirigir al login
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }
} 