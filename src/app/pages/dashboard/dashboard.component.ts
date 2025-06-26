import { Component, inject, input, signal } from '@angular/core';
import { TablaUsuariosComponent } from '../../components/tabla-usuarios/tabla-usuarios.component';
import { UsuariosDropdownComponent } from '../../components/usuarios-dropdown/usuarios-dropdown.component';
import { FormularioRegistroComponent } from '../../components/formulario-registro/formulario-registro.component';
import { GraficosComponent } from '../../components/graficos/graficos.component';
import { Usuario } from '../../classes/usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { mostrarSwal } from '../../utils/swal.util';
import { PublicacionesInactivasComponent } from '../../components/publicaciones-inactivas/publicaciones-inactivas.component';
import { Publicacion } from '../../classes/publicacion';
import { PublicacionesService } from '../../services/publicaciones.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    TablaUsuariosComponent,
    UsuariosDropdownComponent,
    FormularioRegistroComponent,
    GraficosComponent,
    PublicacionesInactivasComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  usuarioSeleccionado = signal<Usuario | null>(null);
  usuarioAeditar = signal<Usuario | null>(null);
  crearUsuario = signal<boolean>(true);
  publicacionesInactivasDelUsuario = signal<Publicacion[]>([]);

  constructor(
    private usuariosService: UsuariosService,
    private publicacionService: PublicacionesService
  ) {}

  recibirUsuario(usuario: Usuario | null) {
    this.usuarioSeleccionado.set(usuario);

    if (usuario) {
      this.publicacionService
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

  registrarAdmin(formData: FormData) {
    this.usuariosService.crearUsuarioAdmin(formData).subscribe({
      next: (res) => {
        mostrarSwal(
          'Administrador registrado',
          'El usuario fue creado correctamente',
          'success'
        );
        this.crearUsuario.set(false);
      },
      error: (error) => {
        mostrarSwal(
          `Error ${error.error.statusCode}`,
          error.error?.message,
          'error'
        );
      },
    });
  }

  decidirCrearUnUsuario() {
    if (this.crearUsuario()) {
      this.crearUsuario.set(false);
    } else {
      this.crearUsuario.set(true);
    }
  }
}
