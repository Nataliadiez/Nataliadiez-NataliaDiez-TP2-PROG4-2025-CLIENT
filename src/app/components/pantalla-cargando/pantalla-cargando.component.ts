import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pantalla-cargando',
  standalone: true,
  templateUrl: './pantalla-cargando.component.html',
  styleUrl: './pantalla-cargando.component.css',
})
export class PantallaCargandoComponent {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const inicio = Date.now();

    this.authService.verificarToken().subscribe({
      next: (res) => {
        const duracion = Date.now() - inicio;
        const delayRestante = Math.max(2500 - duracion, 0);

        setTimeout(() => {
          if (res?.autorizado) {
            this.router.navigate(['publicaciones']);
          } else {
            this.router.navigate(['login']);
          }
        }, delayRestante);
      },
      error: () => {
        const duracion = Date.now() - inicio;
        const delayRestante = Math.max(1500 - duracion, 0);

        setTimeout(() => {
          this.router.navigate(['login']);
        }, delayRestante);
      },
    });
  }
}
