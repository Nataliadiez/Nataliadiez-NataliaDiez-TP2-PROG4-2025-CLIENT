import { Usuario } from '../../classes/usuario';
import { Component, inject, OnInit, input, signal } from '@angular/core';
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
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario-registro',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './formulario-registro.component.html',
  styleUrl: './formulario-registro.component.css',
})
export class FormularioRegistroComponent implements OnInit {
  usuarioAeditar = input<Usuario | null>();
  tituloFormulario = input<string>('Registro de usuario');
  usuariosService = inject(UsuariosService);
  formulario?: FormGroup;
  imagenPerfilFile: File | null = null;
  authService = inject(AuthService);
  submitFn = input<(formData: FormData) => void>();
  esAdmin: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.esAdmin = this.authService.esUsuarioAdmin();
    this.formulario = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        /* Validators.pattern(/[A-Z]/), */ // TODO: evaluar esto para que acepte sólo letras
      ]),
      apellido: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      userName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', Validators.required),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      perfilControl: new FormControl('usuario'),
    });

    if (!this.esAdmin) {
      this.perfilControl.setValue('usuario');
      this.perfilControl.disable();
    }
  }

  get perfilControl(): FormControl {
    return this.formulario?.get('perfilControl') as FormControl;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) this.imagenPerfilFile = file;
  }

  enviarFormulario() {
    if (!this.formulario?.valid) return;

    if (
      this.formulario.value.password !== this.formulario.value.confirmPassword
    ) {
      mostrarSwal(`Error!`, 'Las contraseñas no coinciden.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.formulario.value.nombre),
      formData.append('apellido', this.formulario.value.apellido),
      formData.append('email', this.formulario.value.email),
      formData.append('userName', this.formulario.value.userName),
      formData.append('password', this.formulario.value.password),
      formData.append('fechaNacimiento', this.formulario.value.fechaNacimiento),
      formData.append('descripcion', this.formulario.value.descripcion),
      formData.append('imagenPerfil', this.imagenPerfilFile!);

    const perfil = this.esAdmin ? this.perfilControl.value : 'usuario';
    formData.append('perfil', perfil);

    if (this.submitFn()) {
      this.submitFn()!(formData);
      this.limpiarFormulario();
    }
  }

  limpiarFormulario() {
    this.formulario?.reset();
    this.imagenPerfilFile = null;
  }

  get nombre() {
    return this.formulario?.get('nombre');
  }
  get apellido() {
    return this.formulario?.get('apellido');
  }
  get userName() {
    return this.formulario?.get('userName');
  }
  get email() {
    return this.formulario?.get('email');
  }
  get fechaNacimiento() {
    return this.formulario?.get('fechaNacimiento');
  }
  get descripcion() {
    return this.formulario?.get('descripcion');
  }
  get password() {
    return this.formulario?.get('password');
  }
  get confirmPassword() {
    return this.formulario?.get('confirmPassword');
  }

  get perfil() {
    return this.formulario?.get('perfil');
  }

  getError(control: AbstractControl | null | undefined): string {
    let error = '';
    if (control) {
      if (control.touched && control.hasError('required'))
        error = 'No puede estar vacío.';
      if (control.touched && control.hasError('minlength'))
        error = `Debe tener como mínimo ${
          control.getError('minlength').requiredLength
        } caracteres.`;
      if (control.touched && control.hasError('maxlength'))
        error = 'Debe tener como máximo el largo permitido.';
      if (control.touched && control.hasError('email'))
        error = 'El email debe ser válido.';
      if (control.touched && control.hasError('pattern'))
        error =
          'Debe contener al menos una mayúscula, un número y 8 caracteres';
    }
    return error;
  }
}
