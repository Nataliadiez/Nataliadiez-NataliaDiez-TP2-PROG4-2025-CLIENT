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
  private perfilAdmin = new BehaviorSubject<boolean>(this.esUsuarioAdmin());
  private timeoutAviso: any;
  private timeoutLogout: any;
  usuarioLogueado$ = this.logueado.asObservable();
  usuarioAdmin$ = this.perfilAdmin.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

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
    clearTimeout(this.timeoutAviso);
    clearTimeout(this.timeoutLogout);

    localStorage.setItem('token', token);
    this.logueado.next(true);
    this.perfilAdmin.next(this.esUsuarioAdmin());
    this.validarExpiracionToken(token);
  }

  private validarExpiracionToken(token: string) {
    try {
      const payload: any = jwtDecode(token);
      const ahora = Math.floor(Date.now() / 1000);

      if (payload.exp <= ahora) {
        this.cerrarSesion();
        this.router.navigate(['login']);
      } else {
        const tiempoRestante = (payload.exp - ahora) * 1000;
        const tiempoAviso = tiempoRestante - environment.tiempoAviso;

        if (tiempoAviso > 0) {
          this.timeoutAviso = setTimeout(() => {
            this.mostrarModalRenovacion();
          }, tiempoAviso);
        } else {
          this.mostrarModalRenovacion();
        }

        this.timeoutLogout = setTimeout(() => {
          this.cerrarSesion();
          this.router.navigate(['login']);
          mostrarSwal('Sesión finalizada', 'Tu token expiró', 'info');
        }, tiempoRestante);
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

  esUsuarioAdmin(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;

    try {
      const payload: any = jwtDecode(token);
      const perfil = payload.perfil;
      if (perfil === 'administrador') {
        return true;
      } else {
        return false;
      }
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

  verificarToken(): Observable<any> {
    const token = this.obtenerToken();
    if (!token) return of(null);

    return this.http.get(`${environment.apiUrl}/auth/autorizar`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  iniciarVigilanciaToken(): void {
    const token = this.obtenerToken();
    if (token) {
      this.validarExpiracionToken(token);
    }
  }
}
