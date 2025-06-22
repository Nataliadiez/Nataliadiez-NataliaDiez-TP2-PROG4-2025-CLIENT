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

  traerUsuarios(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/usuarios`, {
      headers: {
        Authorization: `Bearer ${this.authService.obtenerToken()}`,
      },
    });
  }
}
