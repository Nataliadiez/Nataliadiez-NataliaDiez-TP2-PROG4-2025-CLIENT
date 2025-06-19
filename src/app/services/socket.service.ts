import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  constructor() {
    this.socket = io(environment.apiUrl);
  }

  onNuevaPublicacion(callback: (data: any) => void) {
    this.socket.on('nueva-publicacion', callback);
  }

  onActualizarPublicacion(callback: (data: any) => void) {
    this.socket.on('actualizar-publicacion', callback);
  }

  onEliminarPublicacion(callback: (data: any) => void) {
    this.socket.on('eliminar-publicacion', callback);
  }

  onNuevoComentario(
    callback: (data: { publicacionId: string; comentario: any }) => void
  ) {
    this.socket.on('nuevo-comentario', callback);
  }
}
