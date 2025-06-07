import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Métodos para la gestión de usuarios
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  updateUserRole(id: number, newRole: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/users/${id}/role`, 
      { role: newRole }, 
      { headers: this.getHeaders() }
    );
  }

  // Métodos para productos
  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`, { headers: this.getHeaders() });
  }

  createProducto(producto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, producto, { headers: this.getHeaders() });
  }

  updateProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, producto, { headers: this.getHeaders() });
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`, { headers: this.getHeaders() });
  }

  // Métodos para categorías
  getCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categorias`, { headers: this.getHeaders() });
  }

  createCategoria(categoria: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/categorias`, categoria, { headers: this.getHeaders() });
  }

  updateCategoria(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/categorias/${id}`, categoria, { headers: this.getHeaders() });
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categorias/${id}`, { headers: this.getHeaders() });
  }

  // Contacto
  enviarMensaje(mensaje: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacto`, mensaje, { headers: this.getHeaders() });
  }
} 