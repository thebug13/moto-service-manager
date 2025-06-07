import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode'; // Cambiado de import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3001'; // URL base del backend
  private loginUrl = `${this.baseUrl}/api/login`;
  private signupUrl = `${this.baseUrl}/api/signup`;
  private tokenKey = 'authToken'; // Clave para almacenar el token en localStorage

  // BehaviorSubject para el estado de inicio de sesión
  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.loginUrl, { email, password }).pipe(
      tap(response => {
        this.saveToken(response.token);
        this._isLoggedIn.next(true); // Emitir que el usuario ha iniciado sesión
      })
    );
  }

  // Nueva función para registro
  signup(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.signupUrl, { email, password });
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    this._isLoggedIn.next(false); // Emitir que el usuario ha cerrado sesión
  }

  // Nuevo método para cerrar sesión completamente
  logout(): void {
    this.removeToken();
    // Cualquier otra lógica de limpieza post-logout
  }

  // Método para verificar si hay un token (y si es válido, si quieres añadir esa lógica)
  private hasToken(): boolean {
    const token = this.getToken();
    return !!token; // Devuelve true si hay un token, false en caso contrario
  }

  // Método para verificar si el usuario está logueado (básico, solo verifica si hay token)
  isLoggedIn(): boolean {
    const token = this.getToken();
    // Aquí puedes añadir lógica para verificar si el token es válido/no ha expirado
    return !!token;
  }

  // Nuevo método para obtener el email del usuario desde el token
  getUserEmail(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.email || null;
      } catch (error) {
        console.error('Error decodificando el token para email:', error);
        return null;
      }
    }
    return null;
  }

  // Nuevo método para obtener el rol del usuario desde el token
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Usar jwtDecode
        return decodedToken.role || null;
      } catch (error) {
        console.error('Error decodificando el token:', error);
        return null;
      }
    }
    return null;
  }

  // TODO: Implementar lógica de expiración de token si es necesario en el frontend
  // TODO: Decodificar token para obtener información del usuario si es necesario
} 