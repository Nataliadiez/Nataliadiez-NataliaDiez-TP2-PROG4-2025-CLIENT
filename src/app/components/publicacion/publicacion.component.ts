import {
  Component,
  OnInit,
  input,
  InputSignal,
  output,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import { Publicacion } from '../../classes/publicacion';
import { mostrarSwal } from '../../utils/swal.util';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './publicacion.component.html',
  styleUrl: './publicacion.component.css',
})
export class PublicacionComponent implements OnInit {
  publicacion: InputSignal<Publicacion | null> = input<Publicacion | null>(
    null
  );

  publicacionAreactivar = output<Publicacion>();

  authService = inject(AuthService);
  publicacionService = inject(PublicacionesService);

  imagenClase = signal<string>('img-horizontal');
  usuarioActualId = '';
  urlBase = environment.apiUrl;

  ngOnInit() {
    this.usuarioActualId = this.authService.obtenerIdUsuario();

    const imagen = this.publicacion()?.imagen;
    if (imagen) {
      this.detectarOrientacion('http://localhost:3000' + imagen);
    }
  }

  detectarOrientacion(url: string) {
    const img = new Image();
    img.onload = () => {
      const esVertical = img.height > img.width;
      this.imagenClase.set(esVertical ? 'img-vertical' : 'img-horizontal');
    };
    img.src = url;
  }

  reactivarPublicacion() {
    const formData = new FormData();
    formData.append('titulo', this.publicacion()!.titulo);
    formData.append('mensaje', this.publicacion()!.mensaje);
    formData.append('estado', 'true');

    this.publicacionService
      .editarPublicacion(formData, this.publicacion()!._id)
      .subscribe({
        next: () => {
          mostrarSwal('¡Publicación reactivada!', '', 'success');
          this.publicacionAreactivar.emit(this.publicacion()!);
        },
        error: (err) => {
          mostrarSwal(
            'Error al reactivar',
            err.error?.message || 'Ocurrió un error inesperado',
            'error'
          );
        },
      });
  }
}
