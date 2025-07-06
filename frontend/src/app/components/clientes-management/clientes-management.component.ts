import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  fecha_registro?: string;
  placa?: string;
  marca?: string;
  modelo?: string;
}

@Component({
  selector: 'app-clientes-management',
  templateUrl: './clientes-management.component.html',
  styleUrls: ['./clientes-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClientesManagementComponent implements OnInit {
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  searchText: string = '';

  // Para crear/editar
  clienteForm: Partial<Cliente> = {};
  editMode: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.isLoading = true;
    this.error = null;
    this.apiService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.filteredClientes = [...this.clientes];
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar clientes.';
        this.isLoading = false;
      }
    });
  }

  filterClientes(): void {
    if (!this.searchText) {
      this.filteredClientes = [...this.clientes];
      return;
    }
    const lower = this.searchText.toLowerCase();
    this.filteredClientes = this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(lower) ||
      c.telefono.includes(lower)
    );
  }

  startEdit(cliente: Cliente): void {
    this.editMode = true;
    this.clienteForm = { ...cliente };
    this.successMessage = null;
    this.error = null;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.clienteForm = { nombre: '', telefono: '' };
  }

  saveCliente(): void {
    if (!this.clienteForm.nombre || !this.clienteForm.telefono || (!this.clienteForm.id && (!this.clienteForm.placa || !this.clienteForm.marca || !this.clienteForm.modelo))) {
      this.error = 'Todos los campos son requeridos.';
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    if (this.editMode && this.clienteForm.id) {
      this.apiService.updateCliente(this.clienteForm.id, this.clienteForm).subscribe({
        next: () => {
          this.successMessage = 'Cliente actualizado correctamente';
          this.loadClientes();
          this.cancelEdit();
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Error al actualizar el cliente.';
          this.isLoading = false;
        }
      });
    } else {
      this.apiService.createCliente(this.clienteForm).subscribe({
        next: () => {
          this.successMessage = 'Cliente y moto creados correctamente';
          this.loadClientes();
          this.cancelEdit();
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Error al crear el cliente y la moto.';
          this.isLoading = false;
        }
      });
    }
  }

  deleteCliente(cliente: Cliente): void {
    if (!confirm('¿Seguro que deseas eliminar este cliente?')) return;
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    this.apiService.deleteCliente(cliente.id).subscribe({
      next: () => {
        this.successMessage = 'Cliente eliminado correctamente';
        this.loadClientes();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al eliminar el cliente.';
        this.isLoading = false;
      }
    });
  }

  newCliente(): void {
    this.editMode = true;
    this.clienteForm = { nombre: '', telefono: '' };
    this.successMessage = null;
    this.error = null;
  }

  toUpperCaseNombre(): void {
    if (this.clienteForm.nombre) {
      this.clienteForm.nombre = this.clienteForm.nombre.toUpperCase();
    }
  }

  toUpperCaseTelefono(): void {
    if (this.clienteForm.telefono) {
      this.clienteForm.telefono = this.clienteForm.telefono.toUpperCase();
    }
  }

  toUpperCaseMarca(): void {
    if (this.clienteForm.marca) {
      this.clienteForm.marca = this.clienteForm.marca.toUpperCase();
    }
  }

  toUpperCaseModelo(): void {
    if (this.clienteForm.modelo) {
      this.clienteForm.modelo = this.clienteForm.modelo.toUpperCase();
    }
  }

  formatPlaca(): void {
    if (this.clienteForm.placa) {
      let placa = this.clienteForm.placa.replace(/\s+/g, '').toUpperCase();
      if (!placa.includes('-') && placa.length === 6) {
        placa = placa.slice(0,3) + '-' + placa.slice(3);
      }
      this.clienteForm.placa = placa;
    }
  }
} 