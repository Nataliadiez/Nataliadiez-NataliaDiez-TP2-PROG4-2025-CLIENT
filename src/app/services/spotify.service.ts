import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor(private http: HttpClient) {}

  obtenerToken() {
    return this.http.get<any>(`${environment.apiUrl}/spotify/token`);
  }
}
