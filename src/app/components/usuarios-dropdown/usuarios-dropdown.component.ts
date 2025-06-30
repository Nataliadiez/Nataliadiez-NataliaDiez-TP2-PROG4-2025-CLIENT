import { UsuariosService } from './../../services/usuarios.service';
import { Component, inject, OnInit, output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../classes/usuario';

@Component({
  selector: 'app-usuarios-dropdown',
  imports: [],
  templateUrl: './usuarios-dropdown.component.html',
  styleUrl: './usuarios-dropdown.component.css',
})
export class UsuariosDropdownComponent implements OnInit {
  authService = inject(AuthService);
  usuariosService = inject(UsuariosService);
  usuarios: Usuario[] = [];
  usuarioSeleccionado = output<Usuario | null>();
  usuarioActivo: Usuario | null = null;

  ngOnInit() {
    this.usuariosService.traerUsuarios(true).subscribe({
      next: (res) => (this.usuarios = res),
      error: (error) => {
        console.error('Error al traer los usuarios', error);
      },
    });
  }

  seleccionarUsuario(id: string) {
    this.usuarioActivo = this.usuarios.find((u) => u._id === id) || null;
    this.usuarioSeleccionado.emit(this.usuarioActivo);
  }
}
