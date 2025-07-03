import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MiperfilService } from '../../services/miperfil.service';
import { Perfil } from '../../classes/perfil';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environments';

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
  urlBase = environment.apiUrl;

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
    // Manejo estado login
    this.authService.usuarioLogueado$.subscribe((estado) => {
      this.estaLogueado.set(estado);
      if (estado) {
        this.miperfilService.perfil$.subscribe((perfil) => {
          if (perfil) {
            this.perfilUsuario.set(perfil.usuario ?? perfil);
            const isEdgerunner = this.edgerunners.includes(
              (perfil.usuario ?? perfil).userName
            );
            const url = isEdgerunner
              ? 'https://open.spotify.com/embed/track/7mykoq6R3BArsSpNDjFQTm?utm_source=generator&theme=0'
              : 'https://open.spotify.com/embed/playlist/7FlQuycOylGER36uH1TcsD?utm_source=generator&theme=0';

            this.listMusic = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            this.edgerunner.set(isEdgerunner);
          }
        });

        this.miperfilService.refrescarPerfil();
      } else {
        this.perfilUsuario.set(null);
        this.listMusic = '';
        this.edgerunner.set(false);
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
