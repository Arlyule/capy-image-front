import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ImagenService } from 'src/app/services/imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.css'],
})
export class ImagenesComponent implements OnInit {
  imagenes: any[] = [];
  imagenesFiltradas: any[] = []; // Arreglo para las imágenes filtradas
  nuevoComentario: string = '';
  currentPage: number = 1;
  imagesPerPage: number = 6;
  loading: boolean = true;
  isTokenAvailable: boolean = false;
  userId: number = 0;
  filtroSeleccionado: string = 'todas'; // Opción seleccionada en el dropdown
  busqueda: string = ''; // Texto ingresado en el buscador

  constructor(
    private imagenService: ImagenService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.checkToken();
    this.cargarImagenes();
    this.userId = parseInt(localStorage.getItem('user_id') || '0', 10);
  }

  checkToken(): void {
    const token = localStorage.getItem('token');
    this.isTokenAvailable = !!token;
  }

  cargarImagenes(): void {
    this.imagenService.obtenerImagenes().subscribe((respuesta) => {
      this.imagenes = respuesta.images;
      this.imagenesFiltradas = [...this.imagenes]; // Inicialmente todas las imágenes
      this.loading = false;
    });
  }

  aplicarFiltro(): void {
    this.currentPage = 1;
    if (this.filtroSeleccionado === 'todas') {
      this.imagenesFiltradas = [...this.imagenes];
    } else if (this.filtroSeleccionado === 'mis-imagenes') {
      this.imagenesFiltradas = this.imagenes.filter(
        (imagen) => imagen.usuario_id === this.userId // Usando userId del localStorage
      );
    } else if (this.filtroSeleccionado === 'fecha') {
      this.imagenesFiltradas = this.imagenes.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
    }

    this.filtrarPorNombre();
  }

  filtrarPorNombre(): void {
    const texto = this.busqueda.toLowerCase();
    this.imagenesFiltradas = this.imagenesFiltradas.filter((imagen) =>
      imagen.nombre_archivo.toLowerCase().includes(texto)
    );
  }

  onBusquedaChange(): void {
    this.aplicarFiltro();
  }

  agregarComentario(imagenId: number): void {
    if (!this.nuevoComentario.trim()) {
      Swal.fire('Error', 'Por favor ingresa un comentario', 'error');
      return;
    }

    const usuarioId = parseInt(localStorage.getItem('user_id') || '0', 10);
    if (!usuarioId) {
      Swal.fire('Error', 'Usuario no autenticado', 'error');
      return;
    }

    const comentario = {
      usuario_id: this.userId,
      imagen_id: imagenId,
      contenido: this.nuevoComentario,
    };

    this.imagenService.agregarComentario(comentario).subscribe(
      (respuesta) => {
        const imagen = this.imagenes.find((img) => img.id === imagenId);
        if (imagen) {
          imagen.comentarios.push(respuesta.comentario);
          this.nuevoComentario = '';
          this.cdr.detectChanges();
          Swal.fire('Éxito', 'Comentario agregado correctamente', 'success');
        }
      },
      (error) => {
        Swal.fire('Error', 'Hubo un error al agregar el comentario', 'error');
      }
    );
  }

  get paginatedImages(): any[] {
    const startIndex = (this.currentPage - 1) * this.imagesPerPage;
    const endIndex = this.currentPage * this.imagesPerPage;
    return this.imagenesFiltradas.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Método para abrir la alerta y cambiar el nombre de la imagen
  abrirCambioNombre(imagen: any): void {
    Swal.fire({
      title: 'Introduce el nuevo nombre de la imagen',
      input: 'text',
      inputValue: imagen.nombre_archivo, // Valor inicial del input
      showCancelButton: true,
      confirmButtonText: 'Cambiar nombre',
      cancelButtonText: 'Cancelar',
      preConfirm: (nuevoNombre) => {
        if (!nuevoNombre || nuevoNombre.trim() === '') {
          Swal.showValidationMessage('El nombre de la imagen no puede estar vacío');
          return;
        }
        return nuevoNombre;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.imagenService.actualizarImagen(imagen.id, result.value).subscribe(
          (respuesta) => {
            imagen.nombre_archivo = result.value; // Actualizamos el nombre de la imagen
            Swal.fire('Éxito', 'El nombre de la imagen se ha actualizado correctamente', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Hubo un error al actualizar el nombre de la imagen', 'error');
          }
        );
      }
    });
  }


  // Método para eliminar una imagen
  eliminarImagen(imagenId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la imagen permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.imagenService.eliminarImagen(imagenId).subscribe(
          (respuesta) => {
            this.imagenes = this.imagenes.filter((img) => img.id !== imagenId);
            this.imagenesFiltradas = [...this.imagenes]; // Actualizamos las imágenes filtradas
            Swal.fire('Éxito', 'Imagen eliminada correctamente', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Hubo un error al eliminar la imagen', 'error');
          }
        );
      }
    });
  }
}
