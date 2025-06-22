export class Usuario {
  _id!: string;
  nombre!: string;
  apellido!: string;
  email!: string;
  userName!: string;
  fechaNacimiento!: Date;
  password?: string;
  descripcion!: string;
  imagenPerfil!: string;
  estado!: boolean;
  perfil!: 'usuario' | 'administrador';

  constructor(init?: Partial<Usuario>) {
    Object.assign(this, init);
  }
}
