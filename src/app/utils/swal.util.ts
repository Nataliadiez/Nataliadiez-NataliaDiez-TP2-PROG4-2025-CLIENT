import Swal from 'sweetalert2';

export function mostrarSwal(
  titulo: string,
  mensaje: string,
  tipo: 'success' | 'error' | 'warning' = 'success'
) {
  Swal.fire({
    icon: tipo,
    text: mensaje,
    title: titulo,
    showCloseButton: true,
    confirmButtonText: 'Ok',
    customClass: {
      popup: 'almicida-style',
      title: 'almicida-style',
      confirmButton: 'almicida-style',
      cancelButton: 'almicida-style',
    },
    buttonsStyling: false,
  });
}

export function swalConOpciones(
  text: string,
  title: string,
  confirmButtonText: string,
  denyButtonText: string
): Promise<string | undefined> {
  return Swal.fire({
    icon: 'question',
    text: text,
    title: title,
    showDenyButton: true,
    confirmButtonText: confirmButtonText,
    denyButtonText: denyButtonText,
    customClass: {
      popup: 'almicida-style',
      title: 'almicida-style',
      confirmButton: 'almicida-style',
      cancelButton: 'almicida-style',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      return 'si';
    } else if (result.isDenied) {
      return 'no';
    }
    return undefined;
  });
}

