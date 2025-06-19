export class Usuario {
  _id!: string;
  userName!: string;
  email?: string;
  imagenPerfil?: string;

  constructor(init?: Partial<Usuario>) {
    Object.assign(this, init);
  }
}
