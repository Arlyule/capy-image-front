import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: any;
  isUserLoggedIn: boolean = false;

  // Declarar router como público
  constructor(public router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Obtener los datos del usuario desde localStorage
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('nombre_usuario');

    if (userId && token && userName) {
      this.user = { id: userId, nombre_usuario: userName, token };
      this.isUserLoggedIn = true; // Usuario está logueado
    } else {
      this.isUserLoggedIn = false; // Usuario no está logueado
    }
  }

  logout(): void {
    this.authService.logout();
    this.isUserLoggedIn = false; // Marcar como deslogueado
    this.router.navigate(['/imagenes']).then(() => {
      window.location.reload();
    });
  }
}
