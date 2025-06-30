import { Component, inject, signal } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { Publicacion } from '../../classes/publicacion';
import { UsuariosService } from '../../services/usuarios.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import { mostrarSwal } from '../../utils/swal.util';
import { TablaUsuariosComponent } from '../../components/tabla-usuarios/tabla-usuarios.component';
import { UsuariosDropdownComponent } from '../../components/usuarios-dropdown/usuarios-dropdown.component';
import { PublicacionesInactivasComponent } from '../../components/publicaciones-inactivas/publicaciones-inactivas.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mostrar-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    TablaUsuariosComponent,
    UsuariosDropdownComponent,
    PublicacionesInactivasComponent,
  ],
  templateUrl: './mostrar-usuarios.component.html',
  styleUrl: './mostrar-usuarios.component.css',
})
export class MostrarUsuariosComponent {
  usuarioSeleccionado = signal<Usuario | null>(null);
  publicacionesInactivasDelUsuario = signal<Publicacion[]>([]);
  usuariosService = inject(UsuariosService);

  constructor(private publicacionesService: PublicacionesService) {}

  recibirUsuario(usuario: Usuario | null) {
    this.usuarioSeleccionado.set(usuario);

    if (usuario) {
      this.publicacionesService
        .traerPublicacionesInactivasPorUsuario(usuario._id)
        .subscribe({
          next: (res) => this.publicacionesInactivasDelUsuario.set(res),
          error: (err) =>
            mostrarSwal(
              `Error ${err.error.statusCode}`,
              err.error.message || 'No se pudieron cargar las publicaciones',
              'error'
            ),
        });
    } else {
      this.publicacionesInactivasDelUsuario.set([]);
    }
  }

  editarUsuario() {
    const user = this.usuarioSeleccionado();
    if (!user) return;
    mostrarSwal('Funcionalidad no implementada aún', '', 'info');
  }

  eliminarUsuario() {
    const user = this.usuarioSeleccionado();
    if (!user) return;

    this.usuariosService.eliminarUsuario(user._id).subscribe({
      next: () => {
        mostrarSwal('Usuario eliminado', '', 'success');
        this.usuarioSeleccionado.set(null);
      },
      error: (error) =>
        mostrarSwal(
          `Error ${error.error.statusCode}`,
          error.error.message || 'No se pudo eliminar el usuario',
          'error'
        ),
    });
  }

  reactivarUsuario() {
    const user = this.usuarioSeleccionado();
    if (!user) return;

    this.usuariosService.reactivarUsuario(user._id).subscribe({
      next: () => {
        mostrarSwal('Usuario reactivado', '', 'success');
        this.usuarioSeleccionado.set({ ...user, estado: true });
      },
      error: (error) =>
        mostrarSwal(
          `Error ${error.error.statusCode}`,
          error.error.message || 'No se pudo reactivar el usuario',
          'error'
        ),
    });
  }
}
