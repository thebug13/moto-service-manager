import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductosComponent } from './components/productos/productos.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { UserManagementComponent } from './components/user-management/user-management.component';

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
        path: 'productos',
        component: ProductosComponent,
      },
      {
        path: 'categorias',
        component: CategoriasComponent,
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
        canActivate: [() => AuthGuard.canActivateWithRoles(['Administrador'])]
      },
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
