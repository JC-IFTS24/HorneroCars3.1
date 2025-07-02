import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterLink } from '@angular/router'; //para que funcione la llamada en el html
import { Router } from '@angular/router'; //para que funcione la llamada en el html



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink ]

})
export class HomePage {
  
   
 
  constructor(private alertController: AlertController, // inyecto alert y router
    private router: Router) {
      
  } 

  
  //-- --//

  async confirmarLogOut() {  // activa alert para confirmacion de logout
    const alert = await this.alertController.create({
      header: 'Confirmar Salida',
      message: '¿Deseas cerrar tu sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cerrar sesión cancelado');
          },
        },
        {
          text: 'Salir',
          handler: () => {
            this.router.navigate(['login'])// deberiamos llamar al metodo cerrarSesion();
          },
        },
      ],
    });
    await alert.present();
  }
}

