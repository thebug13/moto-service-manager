import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand fugaz-one-regular" routerLink="/productos">Crud Node</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link fugaz-one-regular" routerLink="/productos" routerLinkActive="active">Productos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link fugaz-one-regular" routerLink="/categorias" routerLinkActive="active">Categorías</a>
            </li>
            <li class="nav-item" *ngIf="isAdmin">
              <a class="nav-link fugaz-one-regular" routerLink="/user-management" routerLinkActive="active">Gestión de Usuarios</a>
            </li>
          </ul>
          <span class="navbar-text me-3 text-light fugaz-one-regular">
            Rol: {{ userRole }}
          </span>
          <button class="btn btn-danger fugaz-one-regular" (click)="logout()">
            <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userEmail: string | null = null;
  userRole: string | null = null;
  isAdmin: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.userEmail = this.authService.getUserEmail();
        this.userRole = this.authService.getUserRole();
        this.isAdmin = this.userRole === 'Administrador';
      } else {
        this.userEmail = null;
        this.userRole = null;
        this.isAdmin = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 