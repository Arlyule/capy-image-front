import { Component } from '@angular/core';
import { ImagenService } from '../../services/imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subir-imagen',
  templateUrl: './subir-imagen.component.html',
  styleUrls: ['./subir-imagen.component.css'],
})
export class SubirImagenComponent {
  selectedFile: File | null = null;
  imagenNombre: string = ''; // Para almacenar el nombre de la imagen
  dragging: boolean = false;
  isUploading: boolean = false; // Estado de la carga
  isImageUploaded: boolean = false; // Controla si la imagen ha sido subida o no

  constructor(private imagenService: ImagenService) { }

  // Este método solo selecciona el archivo, sin subirlo inmediatamente
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.selectedFile = files[0];
    }
  }

  // Este método solo se ejecuta cuando el usuario presiona el botón "Subir Imagen"
  subirImagen(): void {
    if (!this.selectedFile || !this.imagenNombre.trim()) {
      Swal.fire('Error', 'Por favor seleccione una imagen y ponga un nombre', 'error');
      return;
    }

    this.isUploading = true; // Iniciar la carga

    this.imagenService.subirImagen(this.selectedFile, this.imagenNombre).subscribe(
      (response) => {
        Swal.fire('Exito', 'Imagen subida correctamente', 'success');
        this.resetForm(); // Reiniciar el formulario
      },
      (error) => {
        console.error('Error al subir la imagen:', error);
        Swal.fire('Error', 'Hubo un problema al subir la imagen', 'error');
        this.isUploading = false; // Termina la carga
      }
    );
  }

  // Resetear el formulario después de una carga exitosa
  resetForm(): void {
    this.selectedFile = null;
    this.imagenNombre = ''; // Limpiar el nombre de la imagen
    this.isUploading = false; // Termina la carga
    this.isImageUploaded = false; // Se marca como no subida
  }

  selectFile(): void {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  quitarImagen(): void {
    this.selectedFile = null;
    this.imagenNombre = ''; // Limpiar el nombre de la imagen
    this.isImageUploaded = false; // Se marca como no subida
  }
}
