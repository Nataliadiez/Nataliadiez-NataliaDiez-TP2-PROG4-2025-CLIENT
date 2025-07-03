import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MiperfilService } from '../../services/miperfil.service';
import { PerfilRespuesta } from '../../interfaces/perfilRespuesta';
import { PublicacionComponent } from '../../components/publicacion/publicacion.component';
import { Publicacion } from '../../classes/publicacion';
import { Perfil } from '../../classes/perfil';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { mostrarSwal } from '../../utils/swal.util';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-perfil',
  imports: [PublicacionComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  authService = inject(AuthService);
  miperfilService = inject(MiperfilService);
  formulario?: FormGroup;

  perfil: Perfil | null = null;
  publicaciones: Publicacion[] = [];
  modoEdicion = signal<boolean>(false);
  imagenPerfilFile: File | null = null;
  urlBase = environment.apiUrl;

  ngOnInit(): void {
    this.formulario = new FormGroup({
      userName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(300),
      ]),
    });
    this.miperfilService.obtenerPerfil().subscribe({
      next: (res: PerfilRespuesta) => {
        this.perfil = res.usuario;
        this.publicaciones = res.publicaciones;
      },
      error: (error) =>
        mostrarSwal(
          `Error ${error.error.statusCode}!`,
          error.error?.message || 'Error al traer el perfil',
          'error'
        ),
    });
  }

  editarPerfil() {
    if (this.perfil) {
      this.formulario?.patchValue({
        userName: this.perfil.userName,
        email: this.perfil.email,
        descripcion: this.perfil.descripcion,
      });
    }

    this.modoEdicion.set(true);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) this.imagenPerfilFile = file;
  }

  enviarFormulario() {
    if (!this.formulario?.valid) return;

    const formData = new FormData();
    formData.append('email', this.formulario.value.email);
    formData.append('userName', this.formulario.value.userName);
    formData.append('descripcion', this.formulario.value.descripcion);

    if (this.imagenPerfilFile) {
      formData.append('imagenPerfil', this.imagenPerfilFile);
    }

    this.miperfilService.actualizarPerfil(formData).subscribe({
      next: (res) => {
        mostrarSwal('Listo!', 'Perfil actualizado correctamente', 'success');
        this.modoEdicion.set(false);
        this.perfil = res.usuario;
      },
      error: (error) => {
        mostrarSwal(
          `Error ${error.error.statusCode}!`,
          error.error?.message || 'Ocurrió un error al actualizar el perfil',
          'error'
        );
      },
    });
  }

  limpiarFormulario() {
    this.formulario?.reset();
    this.imagenPerfilFile = null;
    this.modoEdicion.set(false);
  }

  get userName() {
    return this.formulario?.get('userName');
  }
  get email() {
    return this.formulario?.get('email');
  }

  get descripcion() {
    return this.formulario?.get('descripcion');
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
    }
    return error;
  }
}
