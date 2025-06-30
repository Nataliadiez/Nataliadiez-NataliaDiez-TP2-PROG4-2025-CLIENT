import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  traerUsuarios(incluirInactivos: boolean = false): Observable<any> {
    return this.http.get(`${environment.apiUrl}/usuarios`, {
      headers: {
        Authorization: `Bearer ${this.authService.obtenerToken()}`,
      },
      params: {
        incluirInactivos: incluirInactivos.toString(),
      },
    });
  }

  crearUsuarioAdmin(formData: FormData): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/auth/registroAdmin`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.authService.obtenerToken()}`,
        },
      }
    );
  }
  editarUsuario(userId: string, formData: FormData): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}/usuarios/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.authService.obtenerToken()}`,
        },
      }
    );
  }

  eliminarUsuario(userId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/usuarios/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.authService.obtenerToken()}`,
      },
    });
  }

  reactivarUsuario(userId: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/usuarios/reactivar/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.authService.obtenerToken()}`,
        },
      }
    );
  }
}
