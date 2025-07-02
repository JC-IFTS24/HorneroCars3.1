import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormsModule, Validator, Validators } from '@angular/forms';
import {IonicModule} from '@ionic/angular'
import { LoginAuthService } from 'src/app/services/login-auth.service';
import { eye, eyeOff } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule]
})
export class LoginPage {

   // Inyecciones de dependencias
  private toastController = inject(ToastController);
  private fb=inject(FormBuilder)
  private auth=inject(LoginAuthService)
  emailIncorrecto : boolean = false


  // Formulario reactivo con validaciones
  iniciarSesionForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contraseña: ['', [Validators.required, Validators.minLength(6)]],
  })

  // Para alternar visibilidad de la contraseña
  contraseniaVisible = false;

  mostrarContrasenia(){
    this.contraseniaVisible = !this.contraseniaVisible
  }

  // Método que se ejecuta al hacer submit del formulario
  async enviarForm(){
    if(this.iniciarSesionForm.valid){
      const {email, contraseña} = this.iniciarSesionForm.value
      try{
        await this.auth.iniciarSesion(email!, contraseña!)  // Intenta loguearse
      } catch(error){
        this.emailIncorrecto = true
        this.mostrarToastError('Email no registrado', 'danger');  // Muestra toast de error
      }
    }
    else{
      this.iniciarSesionForm.markAllAsTouched();
      alert('formulario invalido')  
    }
  }

  // Método para registrarse
  async registrarse(){
    if(this.iniciarSesionForm.valid){
      const {email, contraseña} = this.iniciarSesionForm.value
      try {
        await this.auth.registrarse(email!, contraseña!)  // Intenta registrarse
        this.mostrarToastError('Email de verificacion enviada, verifica tu correo para activar tu cuenta', 'success')
      } catch (error) {
       this.mostrarToastError('No logro registrarse, email ya registrado o verifique sus datos', 'danger')
      }
    }
  }
 constructor() {
  addIcons({ eye, eyeOff}); // íconos para su uso en la vista
}

  //El toast para mostrar los avisos y errores
async mostrarToastError(mensaje: string, color: 'danger' | 'success') {
  const toast = await this.toastController.create({
    message: mensaje,
    duration: 2400,
    color: color,
    position: 'middle',
  });
  await toast.present();
}

}
