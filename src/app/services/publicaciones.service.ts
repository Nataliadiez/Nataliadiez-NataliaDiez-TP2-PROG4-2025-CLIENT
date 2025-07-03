import { environment } from './../../environments/environments';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  authService = inject(AuthService);
  apiUrl = environment.apiUrl + '/publicaciones';
  constructor(private http: HttpClient) {}

  crearPublicacion(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData, {
      headers: {
        Authorization: `Bearer ${this.authService.obtenerToken()}`,
      },
    });
  }

  editarPublicacion(
    formData: FormData,
    publicacionId: string
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${publicacionId}`, formData, {
      headers: {
        Authorization: `Bearer ${this.authService.obtenerToken()}`,
      },
    });
  }

  borrarPublicacion(publicacionId: string, esAdmin: boolean): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${publicacionId}`, {
      headers: {
        Authorization: `Bearer ${this.authService.obtenerToken()}`,
        'x-admin': String(esAdmin),
      },
    });
  }

  traerPublicaciones(
    skip: number = 0,
    limit: number = 5,
    orden: string = 'createdAt',
    autorId: string | null
  ): Observable<any> {
    const params = new URLSearchParams();
    params.set('skip', skip.toString());
    params.set('limit', limit.toString());
    params.set('orden', orden);
    if (autorId) {
      params.set('autorId', autorId);
    }

    return this.http.get(`${this.apiUrl}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${this.authService.obtenerToken()}`,
      },
    });
  }

  traerPublicacionesInactivas() {
    return this.http.get(`${environment.apiUrl}/publicaciones/inactivas`, {
      headers: {
        Authorization: `Beares ${this.authService.obtenerToken()}`,
      },
    });
  }

  traerPublicacionesInactivasPorUsuario(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/inactivas/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${this.authService.obtenerToken()}`,
      },
    });
  }

  darLike(publicacionId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${publicacionId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.authService.obtenerToken()}`,
        },
      }
    );
  }

  agregarComentario(publicacionId: string, contenido: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${publicacionId}/comentarios`,
      { contenido },
      {
        headers: {
          Authorization: `Bearer ${this.authService.obtenerToken()}`,
        },
      }
    );
  }

  traerComentarios(
    publicacionId: string,
    skip: number,
    limit: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/${publicacionId}/comentarios`, {
      params,
      headers: {
        Authorization: `Bearer ${this.authService.obtenerToken()}`,
      },
    });
  }

  traerPublicacionPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authService.obtenerToken()}`,
      },
    });
  }
}
