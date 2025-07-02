import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {
  logOutOutline, carSport, carSportOutline, list, listOutline, personCircle, personCircleOutline, camera,
  personOutline, cameraOutline, cardOutline, trash, arrowBackOutline, chevronBackOutline //agregar mas iconos aca

} from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    //se agregan los iconos en constructor
    addIcons({
      logOutOutline,
      carSport,
      carSportOutline,
      list,
      listOutline,
      personCircle,
      personCircleOutline,
      camera,
      personOutline,
      cameraOutline,
      cardOutline,
      trash,
      arrowBackOutline,
      chevronBackOutline
    });
  }
}