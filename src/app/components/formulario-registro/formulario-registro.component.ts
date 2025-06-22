import { Component, input } from '@angular/core';
import { Usuario } from '../../classes/usuario';

@Component({
  selector: 'app-formulario-registro',
  imports: [],
  templateUrl: './formulario-registro.component.html',
  styleUrl: './formulario-registro.component.css',
})
export class FormularioRegistroComponent {
  usuarioAeditar = input<Usuario | null>();
}
