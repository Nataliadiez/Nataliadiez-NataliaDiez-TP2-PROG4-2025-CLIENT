import { Component, input, output } from '@angular/core';
import { Usuario } from '../../classes/usuario';

@Component({
  selector: 'app-tabla-usuarios',
  imports: [],
  templateUrl: './tabla-usuarios.component.html',
  styleUrl: './tabla-usuarios.component.css',
})
export class TablaUsuariosComponent {
  usuarioSeleccionado = input<Usuario | null>();
  editar = output<void>();
  eliminar = output<void>();
  reactivar = output<void>();

  editarUsuario() {
    this.editar.emit();
  }

  eliminarUsuario() {
    this.eliminar.emit();
  }

  reactivarUsuario() {
    this.reactivar.emit();
  }
}
