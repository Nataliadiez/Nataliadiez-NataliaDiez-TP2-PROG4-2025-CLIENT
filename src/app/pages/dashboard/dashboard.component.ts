import { Component, inject, input, signal } from '@angular/core';
import { TablaUsuariosComponent } from '../../components/tabla-usuarios/tabla-usuarios.component';
import { UsuariosDropdownComponent } from '../../components/usuarios-dropdown/usuarios-dropdown.component';
import { FormularioRegistroComponent } from '../../components/formulario-registro/formulario-registro.component';
import { GraficosComponent } from '../../components/graficos/graficos.component';
import { Usuario } from '../../classes/usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { mostrarSwal } from '../../utils/swal.util';

@Component({
  selector: 'app-dashboard',
  imports: [
    TablaUsuariosComponent,
    UsuariosDropdownComponent,
    FormularioRegistroComponent,
    GraficosComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  usuarioSeleccionado = signal<Usuario | null>(null);
  usuarioAeditar = signal<Usuario | null>(null);
  crearUsuario = signal<boolean>(false);

  constructor(private usuariosService: UsuariosService) {}
  recibirUsuario(usuario: Usuario | null) {
    if (usuario !== null) {
      this.usuarioSeleccionado.set(usuario);
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
