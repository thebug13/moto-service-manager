import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ClientesManagementComponent } from './components/clientes-management/clientes-management.component';
import { MotosManagementComponent } from './components/motos-management/motos-management.component';
import { ReparacionesAuxiliarComponent } from './components/reparaciones-auxiliar/reparaciones-auxiliar.component';
import { PayrollComponent } from './components/payroll/payroll.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'clientes',
        component: ClientesManagementComponent,
      },
      {
        path: 'motos',
        component: MotosManagementComponent,
      },
      {
        path: 'reparaciones-auxiliar',
        component: ReparacionesAuxiliarComponent,
        canActivate: [() => AuthGuard.canActivateWithRoles(['Auxiliar'])]
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
        canActivate: [() => AuthGuard.canActivateWithRoles(['Administrador'])]
      },
      {
        path: 'payroll',
        component: PayrollComponent,
        canActivate: [() => AuthGuard.canActivateWithRoles(['Administrador', 'Jefe de taller'])]
      },
      {
        path: 'reparaciones-management',
        loadComponent: () => import('./components/reparaciones-management/reparaciones-management.component').then(m => m.ReparacionesManagementComponent),
        canActivate: [() => AuthGuard.canActivateWithRoles(['Administrador', 'Jefe de taller'])]
      },
      {
        path: '',
        redirectTo: 'clientes',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
