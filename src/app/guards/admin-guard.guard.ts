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

export class adminGuardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.obtenerToken();
    const esAdmin = this.authService.esUsuarioAdmin();

    if (!token || !esAdmin) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
