import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Importar AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isLoggedIn()) {
      return true; // El usuario está autenticado, permitir acceso
    } else {
      // El usuario no está autenticado, redirigir a la página de login
      return this.router.navigate(['/login']);
    }
  }

  // Nuevo método estático para proteger rutas por rol
  static canActivateWithRoles(allowedRoles: string[]) {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      const authService = inject(AuthService);
      const router = inject(Router);

      if (!authService.isLoggedIn()) {
        return router.parseUrl('/login'); // No autenticado, redirigir al login
      }

      const userRole = authService.getUserRole();

      if (userRole && allowedRoles.includes(userRole)) {
        return true; // Rol permitido, permitir acceso
      } else {
        // Rol no permitido, redirigir a una página de acceso denegado o al dashboard
        alert('Acceso denegado. No tienes los permisos necesarios.'); // O mostrar un mensaje más amigable
        return router.parseUrl('/productos'); // Redirigir a productos o a una página de error
      }
    };
  }
} 