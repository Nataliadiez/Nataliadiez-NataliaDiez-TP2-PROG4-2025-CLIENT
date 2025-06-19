import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  formulario?: FormGroup;
  authService = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.formulario = new FormGroup({
      identificador: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  enviarFormulario() {
    if (!this.formulario?.valid) return;

    const { identificador, password } = this.formulario.value;

    const esEmail = identificador.includes('@');

    const datos = esEmail
      ? { email: identificador, password }
      : { userName: identificador, password };
    this.authService.iniciarSesion(datos).subscribe({
      next: (res) => {
        mostrarSwal(
          `Bienvenido, ${res.usuario.nombre}!`,
          `Inicio de sesión exitoso, perfil: ${res.usuario.perfil}`,
          'success'
        );
        this.authService.guardarToken(res.token);

        setTimeout(() => {
          this.router.navigate(['publicaciones']);
        }, 2000);
      },
      error: (error) => {
        mostrarSwal(
          `Error ${error.error.statusCode}!`,
          error.error?.message || 'Ha ocurrido un error al iniciar sesión',
          'error'
        );
      },
    });
  }

  limpiarFormulario() {
    this.formulario?.reset();
  }

  get password() {
    return this.formulario?.get('password');
  }
  get identificador() {
    return this.formulario?.get('identificador');
  }

  getError(control: AbstractControl | null | undefined): string {
    let error = '';
    if (control) {
      if (control.touched && control.hasError('required'))
        error = 'No puede estar vacío.';
    }
    return error;
  }

  inicioRapido() {
    this.formulario?.patchValue({
      identificador: 'Natt10',
      password: 'Natt2025',
    });

    this.enviarFormulario();
  }
}
