import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { mostrarSwal } from '../../utils/swal.util';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormularioRegistroComponent } from '../../components/formulario-registro/formulario-registro.component';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, FormularioRegistroComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  formulario?: FormGroup;
  imagenPerfilFile: File | null = null;
  authService = inject(AuthService);

  constructor(private router: Router) {}

  registrarUsuario(formData: FormData) {
    this.authService.crearCuenta(formData).subscribe({
      next: (res) => {
        mostrarSwal(
          'Usuario registrado exitosamente!',
          `Bienvenido ${res.nombre}`,
          'success'
        );
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        this.authService.iniciarSesion({ email, password }).subscribe({
          next: (loginRes) => {
            const token = loginRes.token;
            this.authService.guardarToken(token);
            this.router.navigate(['/publicaciones']);
          },
          error: (err) => {
            mostrarSwal(
              'No se pudo iniciar sesión automáticamente',
              'Iniciá sesión manualmente por favor',
              'info'
            );
          },
        });
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
}
