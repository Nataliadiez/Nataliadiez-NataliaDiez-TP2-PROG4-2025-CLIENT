import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  estaLogueado = signal<boolean>(false);

  constructor(private router: Router) {}

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((estado) => {
      this.estaLogueado.set(estado);
    });
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.estaLogueado.set(false);
    this.router.navigate(['login']);
  }
}
