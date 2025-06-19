export class Perfil {
  imagenPerfil!: File;
  userName!: string;
  email!: string;
  descripcion!: string;

  constructor(init?: Partial<Perfil>) {
    Object.assign(this, init);
  }
}
