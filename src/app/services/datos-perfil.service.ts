import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences'; // Importa Preferences

@Injectable({
  providedIn: 'root'
})
export class DatosPerfilService {

  // Almacenará los datos del perfil en memoria una vez cargados
  private datosPerfil: any | null = null;
  private readonly STORAGE_KEY = 'datosPerfilUsuario';

  constructor() {
    this.cargarDatosPerfil(); // Carga los datos del perfil al inicializar el servicio
  }

  /* Carga los datos desde Cap Preferences a la propiedad 'datosPerfil' del servicio. Se ejecuta al inicializar el servicio. */
  private async cargarDatosPerfil(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      this.datosPerfil = value ? JSON.parse(value) : null;
      console.log('Datos de perfil cargados al servicio:', this.datosPerfil);
    } catch (error) {
      console.error('Error al cargar datos de perfil desde Capacitor Preferences:', error);
      this.datosPerfil = null; // null en caso de error
    }
  }

  /* Guarda los datos de perfil del usuario en Capacitor Preferences y actualiza la copia en memoria. */
 
  async guardarDatos(datos: any): Promise<void> {
    try {
      this.datosPerfil = datos; // Actualiza la copia en memoria
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(datos)
      });
      console.log('Datos de perfil guardados y actualizados:', this.datosPerfil);
    } catch (error) {
      console.error('Error al guardar datos con Capacitor Preferences:', error);
    }
  }

  /* Obtiene los datos. Si ya están en memoria, los devuelve.
     Si no, los carga desde preferences (aunque ya se deberian haber cargado al inicio). */

 async obtenerDatos(): Promise<any | null> {
  // si no están en memoria, cargalos primero
  if (this.datosPerfil === null) {
    await this.cargarDatosPerfil();
  }
  return this.datosPerfil;
}
  

}