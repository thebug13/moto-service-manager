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

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user, { headers: this.getHeaders() });
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, user, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() });
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

  // Métodos para gestión de clientes
  getClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes`, { headers: this.getHeaders() });
  }

  createCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, cliente, { headers: this.getHeaders() });
  }

  updateCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/clientes/${id}`, cliente, { headers: this.getHeaders() });
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/${id}`, { headers: this.getHeaders() });
  }

  // Métodos para gestión de motos
  getMotos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/motos`, { headers: this.getHeaders() });
  }

  createMoto(moto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/motos`, moto, { headers: this.getHeaders() });
  }

  updateMoto(id: number, moto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/motos/${id}`, moto, { headers: this.getHeaders() });
  }

  deleteMoto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/motos/${id}`, { headers: this.getHeaders() });
  }

  // Métodos para gestión de reparaciones
  getReparaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reparaciones`, { headers: this.getHeaders() });
  }

  /**
   * Crea una nueva reparación
   * @param reparacion Debe incluir: moto_id, auxiliar_id, mano_obra
   */
  createReparacion(reparacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reparaciones`, reparacion, { headers: this.getHeaders() });
  }

  registrarDiagnostico(reparacionId: number, diagnostico: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reparaciones/${reparacionId}/diagnostico`, { diagnostico }, { headers: this.getHeaders() });
  }

  cambiarEstadoReparacion(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reparaciones/${id}/estado`, { estado }, { headers: this.getHeaders() });
  }

  // Obtener auxiliares (usuarios con rol Auxiliar)
  getAuxiliares(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?role=Auxiliar`, { headers: this.getHeaders() });
  }

  // Obtener reparaciones asignadas a un auxiliar
  getReparacionesByAuxiliar(auxiliarId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reparaciones/auxiliar/${auxiliarId}`, { headers: this.getHeaders() });
  }

  // CRUD de repuestos
  getRepuestosByReparacion(reparacionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/repuestos/reparacion/${reparacionId}`, { headers: this.getHeaders() });
  }

  createRepuesto(reparacionId: number, repuesto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/repuestos/reparacion/${reparacionId}`, repuesto, { headers: this.getHeaders() });
  }

  updateRepuesto(repuestoId: number, repuesto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/repuestos/${repuestoId}`, repuesto, { headers: this.getHeaders() });
  }

  deleteRepuesto(repuestoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/repuestos/${repuestoId}`, { headers: this.getHeaders() });
  }

  // Calcular total de repuestos de una reparación
  getTotalRepuestos(reparacionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/repuestos/reparacion/${reparacionId}/total`, { headers: this.getHeaders() });
  }

  /**
   * Actualiza el valor de mano de obra de una reparación
   */
  updateManoObra(reparacionId: number, mano_obra: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/reparaciones/${reparacionId}/mano-obra`, { mano_obra }, { headers: this.getHeaders() });
  }

  /**
   * Obtiene una reparación por su ID
   */
  getReparacionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reparaciones/id/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene el total de una reparación (repuestos + mano de obra)
   */
  getTotalReparacion(reparacionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reparaciones/${reparacionId}/total`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene la suma de mano de obra por auxiliar en un rango de fechas
   */
  getSumaManoObraPorAuxiliar(desde: string, hasta: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reparaciones/reporte/mano-obra/suma?desde=${desde}&hasta=${hasta}`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene las reparaciones detalladas por auxiliar en un rango de fechas
   */
  getReparacionesDetalladasPorAuxiliar(auxiliarId: number, desde: string, hasta: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reparaciones/reporte/detalle/auxiliar/${auxiliarId}?desde=${desde}&hasta=${hasta}`, { headers: this.getHeaders() });
  }
} 