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
  nombre_auxiliar: string;
  password?: string;
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
  searchText: string = '';
  filteredUsers: User[] = [];
  userForm: Partial<User> = {};
  editMode: boolean = false;

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
        this.filteredUsers = [...this.users]; // Initialize filtered users
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

  filterUsers(): void {
    if (!this.searchText) {
      this.filteredUsers = [...this.users];
      return;
    }

    const lowerCaseSearchText = this.searchText.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.email.toLowerCase().includes(lowerCaseSearchText) ||
      user.role.toLowerCase().includes(lowerCaseSearchText)
    );
  }

  newUser(): void {
    this.editMode = true;
    this.userForm = { email: '', nombre_auxiliar: '', role: 'Auxiliar', password: '' };
    this.successMessage = null;
    this.error = null;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.userForm = {};
  }

  saveUser(): void {
    if (!this.userForm.email || !this.userForm.nombre_auxiliar || !this.userForm.role || (!this.userForm.id && !this.userForm.password)) {
      this.error = 'Todos los campos son requeridos.';
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    if (this.editMode && this.userForm.id) {
      // Editar usuario
      this.apiService.updateUser(this.userForm.id, this.userForm).subscribe({
        next: () => {
          this.successMessage = 'Usuario actualizado correctamente';
          this.loadUsers();
          this.cancelEdit();
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Error al actualizar el usuario.';
          this.isLoading = false;
        }
      });
    } else {
      // Crear usuario
      this.apiService.createUser(this.userForm).subscribe({
        next: () => {
          this.successMessage = 'Usuario creado correctamente';
          this.loadUsers();
          this.cancelEdit();
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Error al crear el usuario.';
          this.isLoading = false;
        }
      });
    }
  }

  deleteUser(user: User): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    this.apiService.deleteUser(user.id).subscribe({
      next: () => {
        this.successMessage = 'Usuario eliminado correctamente';
        this.loadUsers();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Error al eliminar el usuario.';
        this.isLoading = false;
      }
    });
  }

  startEdit(user: User): void {
    this.editMode = true;
    this.userForm = { ...user, password: '' };
    this.successMessage = null;
    this.error = null;
  }
} 