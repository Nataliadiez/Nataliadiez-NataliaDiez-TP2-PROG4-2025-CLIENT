import {
  Component,
  OnInit,
  signal,
  inject,
  input,
  InputSignal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicacionesService } from '../../services/publicaciones.service';
import { mostrarSwal } from '../../utils/swal.util';
import { Publicacion } from '../../classes/publicacion';
import { PublicacionComponent } from '../../components/publicacion/publicacion.component';
import { Usuario } from '../../classes/usuario';

@Component({
  selector: 'app-publicaciones-inactivas',
  standalone: true,
  imports: [CommonModule, PublicacionComponent],
  templateUrl: './publicaciones-inactivas.component.html',
  styleUrls: ['./publicaciones-inactivas.component.css'],
})
export class PublicacionesInactivasComponent {
  publicacionesService = inject(PublicacionesService);
  publicacionesInactivas = signal<Publicacion[]>([]);
  usuario = input<Usuario | null>(null);

  publicacionesEffect = effect(() => {
    const user = this.usuario();
    if (!user) {
      this.publicacionesInactivas.set([]);
      return;
    }

    this.publicacionesService
      .traerPublicacionesInactivasPorUsuario(user._id)
      .subscribe({
        next: (res) => this.publicacionesInactivas.set(res),
        error: (err) =>
          mostrarSwal(
            `Error ${err.error.statusCode}`,
            err.error.message || 'No se pudieron cargar las publicaciones',
            'error'
          ),
      });
  });

  onReactivar(publi: Publicacion) {
    this.publicacionesInactivas.update((prev) =>
      prev.filter((p) => p._id !== publi._id)
    );
  }
}
