import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
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
  { path: '**', redirectTo: 'login' },
];
