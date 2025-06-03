import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestión de Categorías</h2>
      
      <!-- Formulario de categoría -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">{{ categoria.id ? 'Editar Categoría' : 'Nueva Categoría' }}</h5>
          <form (ngSubmit)="guardarCategoria()">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="nombre" [(ngModel)]="categoria.nombre" name="nombre" required>
            </div>
            <button type="submit" class="btn btn-primary">
              {{ categoria.id ? 'Actualizar' : 'Crear' }}
            </button>
            <button type="button" class="btn btn-secondary ms-2" (click)="limpiarFormulario()">
              Cancelar
            </button>
          </form>
        </div>
      </div>

      <!-- Lista de categorías -->
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of categorias">
              <td>{{ c.id }}</td>
              <td>{{ c.nombre }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2" (click)="editarCategoria(c)">Editar</button>
                <button class="btn btn-sm btn-danger" (click)="eliminarCategoria(c.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  categoria: any = {
    id: null,
    nombre: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.apiService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  guardarCategoria() {
    if (this.categoria.id) {
      this.apiService.actualizarCategoria(this.categoria.id, this.categoria).subscribe({
        next: () => {
          this.cargarCategorias();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al actualizar categoría:', error);
        }
      });
    } else {
      this.apiService.crearCategoria(this.categoria).subscribe({
        next: () => {
          this.cargarCategorias();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
        }
      });
    }
  }

  editarCategoria(categoria: any) {
    this.categoria = { ...categoria };
  }

  eliminarCategoria(id: number) {
    if (confirm('¿Está seguro de eliminar esta categoría?')) {
      this.apiService.eliminarCategoria(id).subscribe({
        next: () => {
          this.cargarCategorias();
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
        }
      });
    }
  }

  limpiarFormulario() {
    this.categoria = {
      id: null,
      nombre: ''
    };
  }
} 