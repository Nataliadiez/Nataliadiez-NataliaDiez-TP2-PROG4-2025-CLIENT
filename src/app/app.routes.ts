import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { PantallaCargandoComponent } from './components/pantalla-cargando/pantalla-cargando.component';

export const routes: Routes = [
  {
    path: '',
    component: PantallaCargandoComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        (modulo) => modulo.LoginComponent
      ),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.component').then(
        (modulo) => modulo.RegistroComponent
      ),
  },
  {
    path: 'publicaciones',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/publicaciones/publicaciones.component').then(
        (modulo) => modulo.PublicacionesComponent
      ),
  },
  {
    path: 'perfil',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/perfil/perfil.component').then(
        (modulo) => modulo.PerfilComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard, adminGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (modulo) => modulo.DashboardComponent
      ),
  },
  { path: '**', redirectTo: 'login' },
];
