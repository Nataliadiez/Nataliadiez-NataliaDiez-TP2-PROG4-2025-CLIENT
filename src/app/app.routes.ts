import { Routes } from '@angular/router';
import { PantallaCargandoComponent } from './components/pantalla-cargando/pantalla-cargando.component';
import { adminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PantallaCargandoComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.component').then(
        (m) => m.RegistroComponent
      ),
  },
  {
    path: 'publicaciones',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/publicaciones/publicaciones.component').then(
        (m) => m.PublicacionesComponent
      ),
  },
  {
    path: 'perfil',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard, adminGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    children: [
      {
        path: 'usuarios',
        loadComponent: () =>
          import(
            './components/mostrar-usuarios/mostrar-usuarios.component'
          ).then((m) => m.MostrarUsuariosComponent),
      },
      {
        path: 'crear-admin',
        loadComponent: () =>
          import('./components/crear-admin/crear-admin.component').then(
            (m) => m.CrearAdminComponent
          ),
      },
      {
        path: 'publicaciones-inactivas',
        loadComponent: () =>
          import(
            './components/publicaciones-inactivas/publicaciones-inactivas.component'
          ).then((m) => m.PublicacionesInactivasComponent),
      },
      {
        path: 'graficos',
        loadComponent: () =>
          import('./components/graficos/graficos.component').then(
            (m) => m.GraficosComponent
          ),
      },
      {
        path: '',
        redirectTo: 'usuarios',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
