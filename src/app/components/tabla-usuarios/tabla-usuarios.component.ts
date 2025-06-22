import { Component, input } from '@angular/core';
import { Usuario } from '../../classes/usuario';

@Component({
  selector: 'app-tabla-usuarios',
  imports: [],
  templateUrl: './tabla-usuarios.component.html',
  styleUrl: './tabla-usuarios.component.css',
})
export class TablaUsuariosComponent {
  usuarioSeleccionado = input<Usuario | null>();
}
