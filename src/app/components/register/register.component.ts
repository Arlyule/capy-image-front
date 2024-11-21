import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre_usuario: string = '';
  correo_electronico: string = '';
  contrasena: string = '';
  confirm_contrasena: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  // Función para verificar si la contraseña cumple con los requisitos
  isPasswordValid(): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    return passwordRegex.test(this.contrasena);
  }

  // Verifica si el formulario es válido
  isFormValid(): boolean {
    return this.isPasswordValid() && this.contrasena === this.confirm_contrasena;
  }

  register() {
    if (this.contrasena !== this.confirm_contrasena) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    // Verifica si la contraseña es válida
    if (!this.isPasswordValid()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe tener entre 8 y 16 caracteres, incluir al menos una mayúscula y un número.'
      });
      return;
    }

    this.authService.register(this.nombre_usuario, this.correo_electronico, this.contrasena).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Usuario registrado con éxito'
        });
        this.router.navigate(['/login']);
      },
      (error) => {
        console.log(error);
        if (error.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.error
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.error
          });
        }
      }
    );
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
