import { Usuario } from './usuario';
export class Comentario {
  _id!: string;
  contenido!: string;
  usuario!: Usuario;

  constructor(init?: Partial<Comentario>) {
    Object.assign(this, init);
  }
}
