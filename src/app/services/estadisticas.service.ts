import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {
  authService = inject(AuthService);
  constructor(private http: HttpClient) {}

  obtenerPublicacionesPorUsuario(
    desde: string,
    hasta: string
  ): Observable<any[]> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);

    return this.http.get<any[]>(
      `${environment.apiUrl}/estadisticas/publicaciones-por-usuario`,
      {
        params,
        headers: {
          Authorization: `Bearer ${this.authService.obtenerToken()}`,
        },
      }
    );
  }

  obtenercomentariosPorUsuario(
    desde: string,
    hasta: string
  ): Observable<any[]> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);

    return this.http.get<any[]>(
      `${environment.apiUrl}/estadisticas/comentarios-por-tiempo`,
      {
        params,
        headers: {
          Authorization: `Bearer ${this.authService.obtenerToken()}`,
        },
      }
    );
  }

  obtenerComentariosPorPublicacion(
    desde: string,
    hasta: string
  ): Observable<any[]> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<any[]>(
      `${environment.apiUrl}/estadisticas/comentarios-por-publicacion`,
      {
        params,
        headers: {
          Authorization: `Bearer ${this.authService.obtenerToken()}`,
        },
      }
    );
  }
}
