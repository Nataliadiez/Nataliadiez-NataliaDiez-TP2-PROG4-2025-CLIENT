import {
  ChangeDetectorRef,
  NgZone,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PublicacionComponent } from '../../components/publicacion/publicacion.component';
import { PublicacionesService } from '../../services/publicaciones.service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { mostrarSwal } from '../../utils/swal.util';
import { Publicacion } from '../../classes/publicacion';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-publicaciones',
  imports: [
    PublicacionComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css',
})
export class PublicacionesComponent implements OnInit {
  publicaciones = signal<Publicacion[]>([]);
  pagina = signal(0);
  tamanoPagina = 5;
  cargando = signal(false);
  publicacionesService = inject(PublicacionesService);
  socketService = inject(SocketService);
  formulario?: FormGroup;
  imagenPublicacion: File | null = null;
  authService = inject(AuthService);
  imagenActual = signal<string | null>(null);
  ordenActual = signal<'createdAt' | 'likes'>('createdAt');
  modoEdicion = signal(false);
  publicacionEnEdicionId: string | null = null;
  listadoUsuarios = signal<any[]>([]);
  usuarioSeleccionado = signal<string | null>(null);
  mostrarBotonArriba = signal<boolean>(false);
  imagenPreview = signal<string | null>(null);
  imagenClase = signal<string>('img-horizontal');
  hayMasPublicaciones = signal(true);
  totalPublicacionesMostradas = signal(0);

  chequearScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.mostrarBotonArriba.set(scrollY > 300);
  };

  ngOnInit() {
    this.formulario = new FormGroup({
      titulo: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      mensaje: new FormControl('', [
        Validators.required,
        Validators.maxLength(300),
      ]),
    });

    this.socketService.onNuevaPublicacion((publi) => {
      this.publicaciones.update((prev) =>
        prev.some((p) => p._id === publi._id) ? prev : [publi, ...prev]
      );
    });

    this.socketService.onActualizarPublicacion((actualizada) => {
      this.publicaciones.update((prev) =>
        prev.map((p) => (p._id === actualizada._id ? actualizada : p))
      );
    });

    this.socketService.onEliminarPublicacion((id) => {
      const publi = this.publicaciones().find((p) => p._id === id);
      if (!publi) return;
      this.publicaciones.set([]);
      this.pagina.set(0);
      this.cargarPublicaciones();
    });

    this.cargarPublicaciones();
    this.authService.traerListadoUsuarios().subscribe({
      next: (res) => {
        this.listadoUsuarios.set(res);
      },
      error: (error) => {
        mostrarSwal(
          `Error ${error.error.statusCode}!`,
          error.error?.message || 'No se pudieron traer los usuarios',
          'error'
        );
      },
    });

    window.addEventListener('scroll', this.chequearScroll);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.chequearScroll);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.imagenPublicacion = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64 = e.target.result;
      this.imagenPreview.set(base64);

      const img = new Image();
      img.onload = () => {
        const esVertical = img.height > img.width;
        const clase = esVertical ? 'img-vertical' : 'img-horizontal';
        this.imagenClase.set(clase);
      };
      img.src = base64;
    };

    reader.readAsDataURL(file);
  }

  enviarFormulario() {
    if (!this.formulario?.valid) return;

    const formData = new FormData();
    formData.append('titulo', this.formulario.value.titulo),
      formData.append('mensaje', this.formulario.value.mensaje);

    if (this.imagenPublicacion) {
      formData.append('imagen', this.imagenPublicacion);
    }

    if (this.modoEdicion()) {
      this.publicacionesService
        .editarPublicacion(formData, this.publicacionEnEdicionId!)
        .subscribe({
          next: (res) => {
            mostrarSwal('Publicación editada con éxito', '', 'success');
            this.resetFormulario();
          },
          error: (error) => {
            console.error(
              'Error al editar la publicación: ',
              error.error?.message
            );
            mostrarSwal(
              `Error ${error.error.statusCode} !`,
              error.error?.message || 'No se pudo editar la publicación',
              'error'
            );
          },
        });
    } else {
      this.publicacionesService.crearPublicacion(formData).subscribe({
        next: (res) => {
          mostrarSwal(`Publicación creada exitosamente!`, '', 'success');
          this.cargarPublicaciones();
        },
        error: (error) => {
          mostrarSwal(
            `Error ${error.error.statusCode}!`,
            error.error?.message ||
              'Ha ocurrido un error al crear la publicación',
            'error'
          );
        },
      });
    }

    this.resetFormulario();
    this.imagenPublicacion = null;
    this.imagenPreview.set(null);
  }

  get titulo() {
    return this.formulario?.get('titulo');
  }

  get mensaje() {
    return this.formulario?.get('mensaje');
  }

  cargarPublicaciones() {
    if (this.cargando()) return;
    this.cargando.set(true);
    const skip = this.pagina() * this.tamanoPagina;

    this.publicacionesService
      .traerPublicaciones(
        skip,
        this.tamanoPagina,
        this.ordenActual(),
        this.usuarioSeleccionado()
      )
      .subscribe({
        next: ({ nuevas, hasMore }) => {
          const anteriores = this.publicaciones();
          const nuevasSinDuplicados = nuevas.filter(
            (publi: any) => !anteriores.some((p: any) => p._id === publi._id)
          );
          this.publicaciones.set([...anteriores, ...nuevasSinDuplicados]);

          if (!hasMore) {
            this.hayMasPublicaciones.set(false);
          } else {
            this.pagina.update((v) => v + 1);
          }

          this.cargando.set(false);
        },
        error: (err) => {
          console.error('Error al traer publicaciones', err);
          this.cargando.set(false);
        },
      });
  }

  ordenarPorLikes() {
    this.ordenActual.set('likes');
    this.pagina.set(0);
    this.publicaciones.set([]);
    this.hayMasPublicaciones.set(true);
    this.cargarPublicaciones();
  }

  ordenarPorRecientes() {
    this.ordenActual.set('createdAt');
    this.pagina.set(0);
    this.publicaciones.set([]);
    this.hayMasPublicaciones.set(true);
    this.cargarPublicaciones();
  }

  editarPublicacion(publicacion: Publicacion) {
    this.formulario?.patchValue({
      titulo: publicacion.titulo,
      mensaje: publicacion.mensaje,
    });
    this.publicacionEnEdicionId = publicacion._id;
    this.modoEdicion.set(true);
    this.imagenPublicacion = null;
    this.imagenActual.set(publicacion.imagen || null);
    this.volverArriba();
  }

  resetFormulario() {
    this.formulario?.reset();
    this.imagenPublicacion = null;
    this.publicacionEnEdicionId = null;
    this.modoEdicion.set(false);
  }

  filtrarPorUsuario(autorId: string) {
    this.usuarioSeleccionado.set(autorId);
    this.publicaciones.set([]);
    this.hayMasPublicaciones.set(true);
    this.pagina.set(0);
    this.cargarPublicaciones();
  }

  volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  quitarFiltroUsuario() {
    this.usuarioSeleccionado.set(null);
    this.publicaciones.set([]);
    this.hayMasPublicaciones.set(true);
    this.pagina.set(0);
    this.cargarPublicaciones();
  }
}
