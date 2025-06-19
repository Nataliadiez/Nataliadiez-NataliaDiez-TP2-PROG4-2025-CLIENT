import { Usuario } from './usuario';

export class Publicacion {
  _id!: string;
  titulo!: string;
  mensaje!: string;
  imagen?: string;
  autor!: Usuario;
  likes: string[] = [];
  likesCount?: number;
  comentarios: {
    _id: string;
    contenido: string;
    usuario: Usuario;
  }[] = [];
  createdAt!: string;
  updatedAt!: string;
  estado?: boolean;

  constructor(init?: Partial<Publicacion>) {
    Object.assign(this, init);
  }
}
