import { Component, input, signal } from '@angular/core';
import { TablaUsuariosComponent } from '../../components/tabla-usuarios/tabla-usuarios.component';
import { UsuariosDropdownComponent } from '../../components/usuarios-dropdown/usuarios-dropdown.component';
import { FormularioRegistroComponent } from '../../components/formulario-registro/formulario-registro.component';
import { GraficosComponent } from '../../components/graficos/graficos.component';
import { Usuario } from '../../classes/usuario';

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

  recibirUsuario(usuario: Usuario | null) {
    if (usuario !== null) {
      this.usuarioSeleccionado.set(usuario);
    }
  }
}
