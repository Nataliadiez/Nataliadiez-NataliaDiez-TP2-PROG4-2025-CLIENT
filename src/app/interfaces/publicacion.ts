export interface Publicacion {
  _id: string;
  titulo: string;
  mensaje: string;
  imagen?: string;
  likes: string[];
  comentarios: {
    usuario: {
      _id: string;
      userName: string;
      imagenPerfil: string;
    };
    contenido: string;
    fecha: Date;
  }[];

  autor?: {
    _id: string;
    userName: string;
    imagenPerfil: string;
  };

  teGusta?: boolean;
}
