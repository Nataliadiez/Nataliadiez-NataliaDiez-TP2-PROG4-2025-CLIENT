import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { AuthService } from './auth.service';
import { PerfilRespuesta } from '../interfaces/perfilRespuesta';
import { BehaviorSubject, Observable, ObservableLike } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MiperfilService {
  authService = inject(AuthService);
  constructor(private http: HttpClient) {}
  perfilActual = signal<PerfilRespuesta | null>(null);
  private perfilSubject = new BehaviorSubject<PerfilRespuesta | null>(null);
  perfil$ = this.perfilSubject.asObservable();

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

  refrescarPerfil() {
    this.obtenerPerfil().subscribe({
      next: (res) => {
        this.perfilActual.set(res.usuario);
        this.perfilSubject.next(res.usuario);
      },
      error: (err) => console.error('Error al refrescar perfil global', err),
    });
  }
}
