import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { mostrarSwal, swalConOpciones } from '../utils/swal.util';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private logueado = new BehaviorSubject<boolean>(this.estaLogueado());
  usuarioLogueado$ = this.logueado.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.obtenerToken();
  }

  iniciarSesion(userData: {
    password: string;
    username?: string;
    email?: string;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, userData);
  }

  crearCuenta(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/registro`, formData);
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.logueado.next(false);
  }

  guardarToken(token: string) {
    localStorage.setItem('token', token);
    this.logueado.next(true);
    this.validarExpiracionToken(token);
  }

  private validarExpiracionToken(token: string) {
    try {
      const payload: any = jwtDecode(token);
      const ahora = Math.floor(Date.now() / 1000);

      if (payload.exp <= ahora) {
        this.mostrarModalRenovacion();
      } else {
        const tiempoRestante = (payload.exp - ahora) * 1000;
        const tiempoAviso = tiempoRestante - 5 * 60 * 1000;

        setTimeout(() => {
          this.mostrarModalRenovacion();
        }, tiempoAviso);
      }
    } catch (error) {
      console.error('Error al procesar el token', error);
      this.cerrarSesion();
      this.router.navigate(['login']);
    }
  }

  private mostrarModalRenovacion() {
    swalConOpciones(
      '¿Desea extender la sesión 15 minutos más?',
      'El token esta por expirar...',
      'Renovar',
      `Cerrar sesión`
    ).then((respuesta) => {
      if (respuesta === 'si') {
        this.refrescarToken().subscribe({
          next: (res: any) => {
            const nuevoToken = res.token;
            this.guardarToken(nuevoToken);
            mostrarSwal('Sesión extendida con éxito', '', 'success');
          },
          error: (error) => {
            mostrarSwal('No se pudo renovar la sesión', error.message, 'error');
            this.cerrarSesion();
            this.router.navigate(['login']);
          },
        });
      } else {
        this.cerrarSesion();
        this.router.navigate(['login']);
      }
    });
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  estaLogueado(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;

    try {
      const payload: any = jwtDecode(token);
      const ahora = Math.floor(Date.now() / 1000);
      return payload.exp > ahora;
    } catch (error) {
      console.error('Error en el token', error);
      return false;
    }
  }

  obtenerIdUsuario(): string {
    const token = this.obtenerToken();
    if (!token) return '';

    try {
      const payload: any = jwtDecode(token);
      return payload.id || '';
    } catch (error) {
      console.error('Error al decodificar el token: ', error);
      return '';
    }
  }

  obtenerNombreUsuario(): string {
    const token = this.obtenerToken();
    if (!token) return '';
    try {
      const payload: any = jwtDecode(token);
      return payload.nombre || '';
    } catch (error) {
      console.error('Error al decodificar el token: ', error);
      return '';
    }
  }

  refrescarToken(): Observable<any> {
    const token = this.obtenerToken();
    if (!token) return of(null);

    return this.http.post(
      `${environment.apiUrl}/auth/refresh`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  traerListadoUsuarios(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/usuarios/listadoUsuarios`, {
      headers: {
        Authorization: `Bearer ${this.obtenerToken()}`,
      },
    });
  }
}
