import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ImagenesComponent } from './components/imagenes/imagenes.component';
import { SubirImagenComponent } from './components/subir-imagen/subir-imagen.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/imagenes', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'imagenes', component: ImagenesComponent },
  { path: 'subir-imagen', component: SubirImagenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
