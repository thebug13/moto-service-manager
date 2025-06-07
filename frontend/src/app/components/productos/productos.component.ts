import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  producto: any = { nombre: '', precio: 0, categoria_id: null };
  isEditMode = false;
  selectedProductId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isAdmin: boolean = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.isAdmin = this.authService.getUserRole() === 'Administrador';
    this.loadProductos();
    this.loadCategorias();
  }

  cerrarSesion() {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  loadProductos(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.apiService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar productos:', error);
        this.errorMessage = 'Error al cargar productos.';
        this.isLoading = false;
        if (error.status === 401) {
          this.authService.removeToken();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadCategorias(): void {
    this.apiService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error: any) => {
        console.error('Error al cargar categorías para el select:', error);
        // No es crítico si fallan las categorías, el componente puede seguir funcionando sin ellas.
      }
    });
  }

  onEdit(producto: any): void {
    this.isEditMode = true;
    this.selectedProductId = producto.id;
    this.producto = { ...producto };
    this.errorMessage = null;
    this.successMessage = null;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.isEditMode) {
      this.apiService.updateProducto(this.producto.id, this.producto).subscribe({
        next: () => {
          this.successMessage = 'Producto actualizado correctamente';
          this.resetForm();
          this.loadProductos();
        },
        error: (error: any) => {
          console.error('Error al actualizar producto:', error);
          this.errorMessage = 'Error al actualizar producto.';
          this.isLoading = false;
          if (error.status === 401) {
            this.authService.removeToken();
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      this.apiService.createProducto(this.producto).subscribe({
        next: () => {
          this.successMessage = 'Producto creado correctamente';
          this.resetForm();
          this.loadProductos();
        },
        error: (error: any) => {
          console.error('Error al crear producto:', error);
          this.errorMessage = 'Error al crear producto.';
          this.isLoading = false;
          if (error.status === 401) {
            this.authService.removeToken();
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;
      this.apiService.deleteProducto(id).subscribe({
        next: () => {
          this.successMessage = 'Producto eliminado correctamente';
          this.loadProductos();
        },
        error: (error: any) => {
          console.error('Error al eliminar producto:', error);
          this.errorMessage = 'Error al eliminar producto.';
          this.isLoading = false;
          if (error.status === 401) {
            this.authService.removeToken();
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedProductId = null;
    this.producto = { nombre: '', precio: 0, categoria_id: null };
    this.isLoading = false;
  }

  obtenerNombreCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : '';
  }
} 