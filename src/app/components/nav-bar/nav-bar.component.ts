import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MiperfilService } from '../../services/miperfil.service';
import { Perfil } from '../../classes/perfil';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  miperfilService = inject(MiperfilService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  estaLogueado = signal<boolean>(false);
  esAdmin = signal<boolean>(false);
  perfilUsuario = signal<Perfil | null>(null);
  edgerunner = signal<boolean>(false);
  listMusic: SafeResourceUrl = '';
  edgerunners = [
    'davidM',
    'lucyNet',
    'beccaBlast',
    'falcoWheels',
    'mainethetank',
  ];

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((estado) => {
      this.estaLogueado.set(estado);

      if (estado) {
        this.miperfilService.obtenerPerfil().subscribe({
          next: (res) => {
            this.perfilUsuario.set(res.usuario);
            const isEdgerunner = this.edgerunners.includes(
              res.usuario.userName
            );
            const url = isEdgerunner
              ? 'https://open.spotify.com/embed/track/7mykoq6R3BArsSpNDjFQTm?utm_source=generator&theme=0'
              : 'https://open.spotify.com/embed/playlist/7FlQuycOylGER36uH1TcsD?utm_source=generator&theme=0';

            this.listMusic = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          },
          error: (err) => {
            console.error('Error al traer perfil desde navbar', err);
          },
        });
      }
    });

    this.authService.usuarioAdmin$.subscribe((perfil) => {
      this.esAdmin.set(perfil);
    });
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.estaLogueado.set(false);
    this.router.navigate(['login']);
  }
}
