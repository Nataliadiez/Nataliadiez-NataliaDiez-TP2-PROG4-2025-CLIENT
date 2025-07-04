import { inject, Injectable, signal } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { mostrarSwal } from '../utils/swal.util';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.obtenerToken();
    if (!token) {
      this.authService.cerrarSesion();
      this.router.navigate(['login']);
      return false;
    }

    try {
      const payload: any = jwtDecode(token);
      const ahora = Math.floor(Date.now() / 1000);
      if (payload.exp < ahora) {
        this.authService.cerrarSesion();
        this.router.navigate(['login']);
        return false;
      }
    } catch (error) {
      console.error('Token inválido', error);
      mostrarSwal('Error!', 'Token inválido', 'error');
      this.authService.cerrarSesion();
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
