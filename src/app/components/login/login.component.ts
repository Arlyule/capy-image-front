import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo_electronico: string = '';
  contrasena: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (this.correo_electronico && this.contrasena) {
      this.authService.login(this.correo_electronico, this.contrasena).subscribe(
        (response: any) => {
          localStorage.setItem('user_id', response.user_id);
          localStorage.setItem('token', response.token);
          localStorage.setItem('nombre_usuario', response.nombre_usuario);
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: `Bienvenido ${response.nombre_usuario}`
          });
          this.router.navigate(['/imagenes']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Credenciales inválidas'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor ingrese su correo electrónico y contraseña'
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
