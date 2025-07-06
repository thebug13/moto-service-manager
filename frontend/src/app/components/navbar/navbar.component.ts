// Code developed by Felipe Loaiza - https://github.com/thebug13
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userEmail: string | null = null;
  userRole: string | null = null;
  userNombreAuxiliar: string | null = null;
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
        this.userNombreAuxiliar = this.authService.getUserNombreAuxiliar();
        this.isAdmin = this.userRole === 'Administrador' || this.userRole === 'Jefe de taller';
      } else {
        this.userEmail = null;
        this.userRole = null;
        this.userNombreAuxiliar = null;
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