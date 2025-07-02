import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  private readonly PHOTO_KEY = 'foto_guardada_base64';

  constructor() { }

  /* Abre la camara, saca foto y la devuelve en base64 */
  async sacarFoto(): Promise<string | undefined> {
    try {
      const imagen = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (imagen.base64String) {
        return imagen.base64String;
      }
      return undefined;
    } catch (error) {
      console.error('Error al tomar foto:', error);
      return undefined;
    }
  }

 /* Guarda la foto sacada */
  async guardarFoto(fotoBase64: string): Promise<void> {
    await Preferences.set({
      key: this.PHOTO_KEY,
      value: fotoBase64
    });
  }

 /* Carga la foto guardada */
  async cargarFoto(): Promise<string | undefined> {
    const { value } = await Preferences.get({ key: this.PHOTO_KEY });
    return value || undefined;
  }

  
   /* Elimina la foto guardada */
  async eliminarFoto(): Promise<void> {
    await Preferences.remove({ key: this.PHOTO_KEY });
  }
}