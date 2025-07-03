import { Component } from '@angular/core';
import { FormularioRegistroComponent } from '../../components/formulario-registro/formulario-registro.component';
import { UsuariosService } from '../../services/usuarios.service';
import { mostrarSwal } from '../../utils/swal.util';

@Component({
  selector: 'app-crear-admin',
  standalone: true,
  imports: [FormularioRegistroComponent],
  template: `
    <app-formulario-registro
      [tituloFormulario]="'Registro de usuarios admin'"
      [submitFn]="registrarAdmin.bind(this)"
    />
  `,
})
export class CrearAdminComponent {
  constructor(private usuariosService: UsuariosService) {}

  registrarAdmin(formData: FormData) {
    formData.append('perfil', 'administrador');
    this.usuariosService.crearUsuarioAdmin(formData).subscribe({
      next: () =>
        mostrarSwal(
          'Admin creado',
          'Usuario registrado correctamente',
          'success'
        ),
      error: (err) =>
        mostrarSwal(
          `Error ${err.error.statusCode}`,
          err.error?.message || 'No se pudo crear el admin',
          'error'
        ),
    });
  }
}
