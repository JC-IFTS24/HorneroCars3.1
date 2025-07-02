import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {

  private usuarioActual: User | null = null;  // Guarda el usuario actualmente logueado

  // Escucha cambios en el estado de autenticación y actualiza usuarioActual
  constructor(private autorizacion: Auth, private router: Router) {
    onAuthStateChanged(this.autorizacion, (usuario) => this.usuarioActual = usuario);
  }

  // Registra un nuevo usuario, envía verificación por email y cierra sesión
  async registrarse(email: string, contraseña: string) {
    const cred = await createUserWithEmailAndPassword(this.autorizacion, email, contraseña);
    await sendEmailVerification(cred.user);
    await signOut(this.autorizacion);
  }

  // Inicia sesión, verifica si el email está verific y lleva a /home
  async iniciarSesion(emial: string, contraseña: string) {
    const cred = await signInWithEmailAndPassword(this.autorizacion, emial, contraseña);
    if (!cred.user.emailVerified) {
      await signOut(this.autorizacion);
      throw new Error("correo no aprobado");
    }
    this.router.navigate(['/home']);
  }

  // Cierra sesión y lleva al login
  async cerrarSesion() {
    await signOut(this.autorizacion);
    this.router.navigate(['/login']);

  }

  // Devuelve true si el usuario está logueado y su correo está verificado
  usuarioLogueado(): boolean {
    return !!this.usuarioActual && this.usuarioActual.emailVerified;
  }
}