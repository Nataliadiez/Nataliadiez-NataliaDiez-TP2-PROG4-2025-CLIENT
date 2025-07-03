import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';
import { AuthService } from '../../services/auth.service';
import { Comentario } from '../../classes/comentario';
import { Publicacion } from '../../classes/publicacion';
import { SocketService } from '../../services/socket.service';
import { mostrarSwal, swalConOpciones } from '../../utils/swal.util';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-abrir-publicacion',
  standalone: true,
  templateUrl: './abrir-publicacion.component.html',
  styleUrl: './abrir-publicacion.component.css',
  imports: [CommonModule, FormsModule],
})
export class AbrirPublicacionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private publicacionesService = inject(PublicacionesService);
  private authService = inject(AuthService);
  private socketService = inject(SocketService);

  imagenClase = signal('img-horizontal');
  publicacion = signal<Publicacion | null>(null);
  comentarios = signal<Comentario[]>([]);
  paginaComentarios = signal(0);
  comentariosLimit = 3;
  hayMasComentarios = signal(true);
  usuarioActualId = this.authService.obtenerIdUsuario();
  modoEdicion = signal(false);
  urlBase = environment.apiUrl;

  nuevoComentario = '';
  puedeEditar = computed(() => {
    return (
      this.usuarioActualId === this.publicacion()?.autor?._id ||
      this.authService.esUsuarioAdmin()
    );
  });

  constructor(private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      mostrarSwal('Error', 'ID de publicación inválida', 'error');
      return;
    }

    this.cargarPublicacion(id);
    this.cargarComentarios(id);

    this.socketService.onNuevoComentario((data) => {
      if (data.publicacionId === this.publicacion()?._id) {
        this.comentarios.update((prev) => [...prev, data.comentario]);
      }
    });
  }

  detectarOrientacion(url: string) {
    const img = new Image();
    img.onload = () => {
      const esVertical = img.height > img.width;
      this.imagenClase.set(esVertical ? 'img-vertical' : 'img-horizontal');
    };
    img.src = url;
  }

  cargarPublicacion(id: string) {
    this.publicacionesService.traerPublicacionPorId(id).subscribe({
      next: (res) => {
        this.publicacion.set(res);
        if (res.imagen) {
          this.detectarOrientacion('http://localhost:3000' + res.imagen);
        }
      },
      error: (err) => {
        mostrarSwal('Error', 'No se encontró la publicación', 'error');
      },
    });
  }

  toggleLike() {
    if (!this.publicacion()) return;

    this.publicacionesService.darLike(this.publicacion()!._id).subscribe({
      next: (res) => {
        this.publicacion()!.likes = res.likes;
      },
      error: (error) => {
        console.error(
          'Error al dar like:',
          error.error.message,
          error.error.statusCode
        );
      },
    });
  }

  cargarComentarios(id: string) {
    if (!this.hayMasComentarios()) return;

    const skip = this.paginaComentarios() * this.comentariosLimit;
    this.publicacionesService
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
          console.error('Error cargando comentarios:', err);
        },
      });
  }

  enviarComentario() {
    const contenido = this.nuevoComentario.trim();
    if (!contenido || !this.publicacion()) return;

    this.publicacionesService
      .agregarComentario(this.publicacion()!._id, contenido)
      .subscribe({
        next: () => {
          this.nuevoComentario = '';
        },
        error: (err) => {
          mostrarSwal(
            'Error',
            err.error?.message || 'No se pudo enviar el comentario',
            'error'
          );
        },
      });
  }

  activarEdicion() {
    this.modoEdicion.set(true);
  }

  cancelarEdicion() {
    this.modoEdicion.set(false);
  }

  guardarCambios() {
    const publi = this.publicacion();
    if (!publi) return;

    const formData = new FormData();
    formData.append('titulo', publi.titulo);
    formData.append('mensaje', publi.mensaje);

    this.publicacionesService.editarPublicacion(formData, publi._id).subscribe({
      next: () => {
        mostrarSwal('Cambios guardados', '', 'success');
        this.modoEdicion.set(false);
      },
      error: (err) => {
        mostrarSwal('Error al guardar', err.error?.message || '', 'error');
      },
    });
  }

  eliminarPublicacion() {
    swalConOpciones(
      '¡Cuidado!',
      '¿Querés eliminar esta publicación?',
      'Sí',
      'No'
    ).then((respuesta) => {
      if (respuesta === 'si') {
        this.publicacionesService
          .borrarPublicacion(
            this.publicacion()!._id,
            this.authService.esUsuarioAdmin()
          )
          .subscribe({
            next: () => mostrarSwal('Publicación eliminada', '', 'success'),
            error: (error) =>
              mostrarSwal(
                `Error ${error.error.statusCode}!`,
                error.error.message,
                'error'
              ),
          });
      } else {
        mostrarSwal('No se eliminó la publicación', '', 'error');
      }
    });
  }

  volverApublicaciones() {
    this.router.navigate(['/publicaciones']);
  }
}
