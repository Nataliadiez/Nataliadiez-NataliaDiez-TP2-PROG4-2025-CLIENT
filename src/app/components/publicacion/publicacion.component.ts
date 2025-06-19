import {
  Component,
  OnInit,
  input,
  InputSignal,
  output,
  signal,
  computed,
  inject,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import { Publicacion } from '../../classes/publicacion';
import { Comentario } from '../../classes/comentario';
import { mostrarSwal, swalConOpciones } from '../../utils/swal.util';
import { SocketService } from '../../services/socket.service';

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
  publicacionAeditar = output<Publicacion>();

  authService = inject(AuthService);
  publicacionService = inject(PublicacionesService);
  socketService = inject(SocketService);

  imagenClase = signal<string>('img-horizontal');
  comentarios = signal<Comentario[]>([]);
  paginaComentarios = signal(0);
  comentariosLimit = 3;
  hayMasComentarios = signal(true);
  usuarioActualId = '';
  nuevoComentario = '';

  propietario = computed(
    () => this.usuarioActualId === this.publicacion()?.autor?._id
  );

  ngOnInit() {
    this.usuarioActualId = this.authService.obtenerIdUsuario();

    const imagen = this.publicacion()?.imagen;
    if (imagen) {
      this.detectarOrientacion('http://localhost:3000' + imagen);
    }

    this.socketService.onNuevoComentario((data) => {
      if (data.publicacionId === this.publicacion()?._id) {
        this.comentarios.update((prev) => [...prev, data.comentario]);
      }
    });

    this.cargarComentarios();
  }

  detectarOrientacion(url: string) {
    const img = new Image();
    img.onload = () => {
      const esVertical = img.height > img.width;
      this.imagenClase.set(esVertical ? 'img-vertical' : 'img-horizontal');
    };
    img.src = url;
  }

  cargarComentarios() {
    const id = this.publicacion()?._id;
    if (!id || !this.hayMasComentarios()) return;

    const skip = this.paginaComentarios() * this.comentariosLimit;

    this.publicacionService
      .traerComentarios(id, skip, this.comentariosLimit)
      .subscribe({
        next: (res) => {
          this.comentarios.update((prev) => [...prev, ...res]);
          this.paginaComentarios.update((v) => v + 1);
          if (res.length < this.comentariosLimit) {
            this.hayMasComentarios.set(false);
          }
        },
        error: (err) => {
          console.error('Error al cargar comentarios:', err);
          mostrarSwal('Error', 'No se pudieron traer los comentarios', 'error');
        },
      });
  }

  toggleLike() {
    this.publicacionService.darLike(this.publicacion()!._id).subscribe({
      next: (res) => {
        this.publicacion()!.likes = res.likes;
      },
      error: (err) => {
        console.error('Error al dar like:', err);
      },
    });
  }

  enviarComentario() {
    const contenido = this.nuevoComentario.trim();
    if (!contenido) return;

    this.publicacionService
      .agregarComentario(this.publicacion()!._id, contenido)
      .subscribe({
        next: () => {
          this.nuevoComentario = '';
        },
        error: (err) => {
          console.error('Error al enviar comentario:', err);
        },
      });
  }

  onEdit() {
    if (this.propietario()) {
      this.publicacionAeditar.emit(this.publicacion()!);
    }
  }

  eliminarPublicacion() {
    swalConOpciones(
      '¡Cuidado!',
      '¿Querés eliminar esta publicación?',
      'Sí',
      'No'
    ).then((respuesta) => {
      if (respuesta === 'si') {
        this.publicacionService
          .borrarPublicacion(this.publicacion()!._id)
          .subscribe({
            next: () => mostrarSwal('Publicación eliminada', '', 'success'),
            error: (err) => mostrarSwal('Error', err.message, 'error'),
          });
      } else {
        mostrarSwal('No se eliminó la publicación', '', 'error');
      }
    });
  }
}
