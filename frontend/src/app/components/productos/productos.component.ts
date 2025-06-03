import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestión de Productos</h2>
      
      <!-- Formulario de producto -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">{{ producto.id ? 'Editar Producto' : 'Nuevo Producto' }}</h5>
          <form (ngSubmit)="guardarProducto()">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="nombre" [(ngModel)]="producto.nombre" name="nombre" required>
            </div>
            <div class="mb-3">
              <label for="precio" class="form-label">Precio</label>
              <input type="number" class="form-control" id="precio" [(ngModel)]="producto.precio" name="precio" required>
            </div>
            <div class="mb-3">
              <label for="categoria" class="form-label">Categoría</label>
              <select class="form-select" id="categoria" [(ngModel)]="producto.categoria_id" name="categoria_id" required>
                <option value="">Seleccione una categoría</option>
                <option *ngFor="let categoria of categorias" [value]="categoria.id">
                  {{ categoria.nombre }}
                </option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">
              {{ producto.id ? 'Actualizar' : 'Crear' }}
            </button>
            <button type="button" class="btn btn-secondary ms-2" (click)="limpiarFormulario()">
              Cancelar
            </button>
          </form>
        </div>
      </div>

      <!-- Lista de productos -->
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of productos">
              <td>{{ p.id }}</td>
              <td>{{ p.nombre }}</td>
              <td>{{ p.precio | currency }}</td>
              <td>{{ obtenerNombreCategoria(p.categoria_id) }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2" (click)="editarProducto(p)">Editar</button>
                <button class="btn btn-sm btn-danger" (click)="eliminarProducto(p.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  producto: any = {
    id: null,
    nombre: '',
    precio: 0,
    categoria_id: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos() {
    this.apiService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
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

  guardarProducto() {
    if (this.producto.id) {
      this.apiService.actualizarProducto(this.producto.id, this.producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al actualizar producto:', error);
        }
      });
    } else {
      this.apiService.crearProducto(this.producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al crear producto:', error);
        }
      });
    }
  }

  editarProducto(producto: any) {
    this.producto = { ...producto };
  }

  eliminarProducto(id: number) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.apiService.eliminarProducto(id).subscribe({
        next: () => {
          this.cargarProductos();
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
        }
      });
    }
  }

  limpiarFormulario() {
    this.producto = {
      id: null,
      nombre: '',
      precio: 0,
      categoria_id: ''
    };
  }

  obtenerNombreCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : '';
  }
} 