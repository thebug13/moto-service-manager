import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {

  private userActivity = new Subject<void>();
  private destroy$ = new Subject<void>();
  private readonly INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos en milisegundos

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userActivity.pipe(
      debounceTime(this.INACTIVITY_TIMEOUT), // Espera 5 minutos de inactividad
      takeUntil(this.destroy$)
    ).subscribe(() => {
      console.log('Inactividad detectada. Cerrando sesión...');
      this.authService.removeToken();
      this.router.navigate(['/login']);
    });

    // Emitir un evento inicial para iniciar el temporizador
    this.userActivity.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  logActivity(): void {
    this.userActivity.next();
  }
} 