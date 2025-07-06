import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Moto {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  cliente_id: number;
  cliente_nombre?: string;
  cliente_telefono?: string;
}

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
}

@Component({
  selector: 'app-motos-management',
  templateUrl: './motos-management.component.html',
  styleUrls: ['./motos-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MotosManagementComponent implements OnInit {
  motos: Moto[] = [];
  filteredMotos: Moto[] = [];
  clientes: Cliente[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  searchText: string = '';

  // Para crear/editar
  motoForm: Partial<Moto> = {};
  editMode: boolean = false;
  showForm: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadMotos();
    this.loadClientes();
  }

  loadMotos(): void {
    this.isLoading = true;
    this.error = null;
    this.apiService.getMotos().subscribe({
      next: (data) => {
        this.motos = data;
        this.filteredMotos = [...this.motos];
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar motos.';
        this.isLoading = false;
      }
    });
  }

  loadClientes(): void {
    this.apiService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: () => {
        this.clientes = [];
      }
    });
  }

  filterMotos(): void {
    if (!this.searchText) {
      this.filteredMotos = [...this.motos];
      return;
    }
    const lower = this.searchText.toLowerCase();
    this.filteredMotos = this.motos.filter(m =>
      m.placa.toLowerCase().includes(lower) ||
      m.marca.toLowerCase().includes(lower) ||
      m.modelo.toLowerCase().includes(lower) ||
      (m.cliente_nombre && m.cliente_nombre.toLowerCase().includes(lower))
    );
  }

  startEdit(moto: Moto): void {
    this.editMode = true;
    this.showForm = true;
    this.motoForm = { ...moto };
    this.successMessage = null;
    this.error = null;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.showForm = false;
    this.motoForm = {};
  }

  saveMoto(): void {
    if (!this.motoForm.placa || !this.motoForm.marca || !this.motoForm.modelo || !this.motoForm.cliente_id) {
      this.error = 'Todos los campos son requeridos.';
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    if (this.editMode && this.motoForm.id) {
      this.apiService.updateMoto(this.motoForm.id, this.motoForm).subscribe({
        next: () => {
          this.successMessage = 'Moto actualizada correctamente';
          this.loadMotos();
          this.cancelEdit();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Error al actualizar la moto.';
          this.isLoading = false;
        }
      });
    } else {
      this.apiService.createMoto(this.motoForm).subscribe({
        next: () => {
          this.successMessage = 'Moto creada correctamente';
          this.loadMotos();
          this.cancelEdit();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Error al crear la moto.';
          this.isLoading = false;
        }
      });
    }
  }

  deleteMoto(moto: Moto): void {
    if (!confirm('¿Seguro que deseas eliminar esta moto?')) return;
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    this.apiService.deleteMoto(moto.id).subscribe({
      next: () => {
        this.successMessage = 'Moto eliminada correctamente';
        this.loadMotos();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al eliminar la moto.';
        this.isLoading = false;
      }
    });
  }

  newMoto(): void {
    this.editMode = false;
    this.showForm = true;
    this.motoForm = {};
    this.successMessage = null;
    this.error = null;
  }
} 