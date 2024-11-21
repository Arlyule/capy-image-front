import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(correo_electronico: string, contrasena: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { correo_electronico, contrasena });
  }

  register(nombre_usuario: string, correo_electronico: string, contrasena: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, { nombre_usuario, correo_electronico, contrasena });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('nombre_usuario');
  }
}
