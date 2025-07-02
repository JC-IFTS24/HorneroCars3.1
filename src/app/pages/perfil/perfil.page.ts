import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import { Router, RouterLink } from '@angular/router'; //para que funcione la llamada en el html
import { DatosPerfilService } from 'src/app/services/datos-perfil.service'; // Importa el servicio datos-perfil
import { ToastController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormsModule, Validator, Validators, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})


export class PerfilPage implements OnInit {
  private fb = inject(FormBuilder)
  nombreArchivo: string = 'Ningún archivo seleccionado'; // Le dejo un nombre por default porque yafu
  fotoBase64: string | undefined;
  formPerfil: FormGroup;
  segmentoActual: string = 'mis-datos';   // Variable para controlar el segmento activo, por defecto 'mis-datos'


  constructor(private cameraService: CameraService,
              private datosPerfilService: DatosPerfilService, 
              private toastController: ToastController, 
              private router: Router
  )  {  // Inyecta servicios

    //Validators para el formgroup (formPerfil)
      this.formPerfil = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
    });
    this.cargarDatosGuardados();  //carga los datos guardados en el formulario
  }

/* funciones sobre el form */
// Método para guardar cambios, mostrar toast y redirigir
  async guardarCambios() { 
    if (this.formPerfil.valid) {
      // Guarda los datos usando el servicio (ahora es asíncrono)
      await this.datosPerfilService.guardarDatos(this.formPerfil.value);

      // Muestra el Toast de éxito
      const toast = await this.toastController.create({
        message: 'Datos de perfil guardados exitosamente.', 
        duration: 1400,
        color: 'success', 
        position: 'middle',
      });
      await toast.present();
      await toast.onDidDismiss();
      // Redirige a la página de reservas después de que el toast se haya presentado
      this.router.navigate(['/home/reservar']); 
    } else {
      console.log('Formulario inválido, no se pueden guardar los cambios.');
      // Muestra un toast de error si el formulario es inválido
      const errorToast = await this.toastController.create({
        message: 'Por favor, completa todos los campos requeridos y corrige los errores.',
        duration: 1000,
        color: 'danger',
        position: 'middle',
      });
      await errorToast.present();
      this.formPerfil.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores de validación
    }
  }

  async cargarDatosGuardados() { //obtiene los datos guardados
  const datos = await this.datosPerfilService.obtenerDatos();
  if (datos) {
    this.formPerfil.patchValue(datos);
  }
}

  cancelarCambios() {
    this.cargarDatosGuardados();   // Se cancelan los cambios
  }
  
/* funciones sobre la camra */
  async ngOnInit() {
    // Cargar la foto guardada solo si el segmento es 'documentacion-fotografica' al inicio
    if (this.segmentoActual === 'documentacion-fotografica') {
      await this.cargarFotoGuardada();
    }
  }

  // Metodo para cambiar el segmento
  cambiarSegmento(event: any) {
    this.segmentoActual = event.detail.value;
    // Si el segmento cambia a 'documentacion-fotografica', carga la foto
    if (this.segmentoActual === 'documentacion-fotografica' && !this.fotoBase64) {
      this.cargarFotoGuardada();
    }
  }

  // Funcion para sacar foto con la camara
  async sacarFoto() {
    this.fotoBase64 = await this.cameraService.sacarFoto();

    if (this.fotoBase64) {
      this.nombreArchivo = 'Foto Capturada';
      await this.cameraService.guardarFoto(this.fotoBase64);
    } else {
      this.nombreArchivo = 'Ningún archivo seleccionado';
    }
  }

  // Carga la foto guardada desde el servicio
  async cargarFotoGuardada() {
    this.fotoBase64 = await this.cameraService.cargarFoto();
    if (this.fotoBase64) {
      this.nombreArchivo = 'Foto Guardada';
    }
  }

  // Elimina la foto guardada
  async eliminarFoto() {
    await this.cameraService.eliminarFoto();
    this.fotoBase64 = undefined;
    this.nombreArchivo = 'Ningún archivo seleccionado';
  }
}
