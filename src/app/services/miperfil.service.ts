import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { AuthService } from './auth.service';
import { PerfilRespuesta } from '../interfaces/perfilRespuesta';
import { Observable, ObservableLike } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MiperfilService {
  authService = inject(AuthService);
  constructor(private http: HttpClient) {}

  obtenerPerfil(): Observable<PerfilRespuesta> {
    return this.http.get<PerfilRespuesta>(`${environment.apiUrl}/usuarios/me`, {
      headers: {
        Authorization: `Bearer ${this.authService.obtenerToken()}`,
      },
    });
  }

  actualizarPerfil(formData: FormData): Observable<any> {
    return this.http.post<PerfilRespuesta>(
      `${environment.apiUrl}/usuarios/me`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.authService.obtenerToken()}`,
        },
      }
    );
  }
}
