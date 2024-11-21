import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImagenService {
  private apiUrl = `${environment.apiUrl}/images`;
  private apiUrl2 = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) { }

  // Método para subir una imagen en base64, incluyendo el nombre
  subirImagen(imagenFile: File, nombre: string): Observable<any> {
    const usuarioId = parseInt(localStorage.getItem('user_id') || '0', 10);
    const token = localStorage.getItem('token');

    if (!usuarioId || !token) {
      throw new Error('Usuario no autenticado o token no encontrado.');
    }

    const reader = new FileReader();

    reader.readAsDataURL(imagenFile);
    return new Observable((observer) => {
      reader.onload = () => {
        const imagenBase64 = reader.result as string;
        const nombreArchivo = nombre || imagenFile.name;  // Usar el nombre proporcionado
        const formato = imagenFile.type.split('/')[1];
        const tamanoNormal = imagenFile.size;
        const tamano = Math.floor(tamanoNormal / 1024);  // Tamaño en KB

        const body = {
          usuario_id: usuarioId,
          nombre_archivo: nombreArchivo,
          imagen_base64: imagenBase64,
          formato: formato,
          tamano: tamano,
        };
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        this.http
          .post<any>(`${this.apiUrl}/upload`, body, { headers })
          .subscribe(
            (response) => {
              observer.next(response);
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
      };

      reader.onerror = (error) => {
        observer.error(error);
      };
    });
  }

  // Método para obtener la lista de imágenes
  obtenerImagenes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  // Método para agregar un comentario a una imagen
  agregarComentario(comentario: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(`${this.apiUrl2}/add`, comentario, { headers });
  }

  // Método para actualizar el nombre de una imagen
  actualizarImagen(id: number, nuevoNombre: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = { newName: nuevoNombre };

    return this.http.put<any>(`${this.apiUrl}/${id}`, body, { headers });
  }

  // Método para eliminar una imagen y sus comentarios relacionados
  eliminarImagen(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
