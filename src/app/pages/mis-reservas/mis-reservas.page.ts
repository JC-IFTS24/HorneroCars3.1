import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonCardContent, IonText, IonFooter, IonIcon, IonInfiniteScrollContent, IonInfiniteScroll, IonBadge } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { ReservarService } from 'src/app/services/reservar.service';
import { Reserva } from 'src/app/models/reserva.model';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.page.html',
  styleUrls: ['./mis-reservas.page.scss'],
  standalone: true,
  imports: [IonBadge, IonInfiniteScroll, IonInfiniteScrollContent, IonText, IonCardContent, IonButton, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, CommonModule, FormsModule]
})
export class MisReservasPage implements OnInit {

  reservas: Reserva[] = [];
  reservasTodas: Reserva[] = [];  // ← todas las reservas cargadas     // ← las que se muestran en pantalla
  mostrarCantidad: number = 5;


  getClaseEstado(estado: string): string {
  switch (estado) {
    case 'Pagada':
      return 'estado-pagada';
    case 'Confirmada':
    case 'Pendiente de Pago':
      return 'estado-pendiente';
    case 'Cancelada':
      return 'estado-cancelada';
    default:
      return 'estado-default';
  }
}

  constructor(
    private reservarService: ReservarService,
    private navCtrl: NavController
  ) { }



  async ngOnInit() {
    this.reservasTodas = await this.reservarService.obtenerReservas();
    this.reservas = this.reservasTodas.slice(0, this.mostrarCantidad);
  }

  async cargarMasReservas(event: any) {
    console.log('🔥 Scroll detectado, cargando más reservas...');
    this.mostrarCantidad += 5;
    this.reservas = this.reservasTodas.slice(0, this.mostrarCantidad);

    // Simula carga con una pequeña demora (como red real)
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  async cancelarReserva(reservaId: string) {
    const reserva = this.reservas.find(r => r.reservaId === reservaId);
    if (reserva) {
      reserva.estado = 'Cancelada';
      await this.reservarService.guardarReservas(this.reservas);
    }
  }

  irAPagar(reservaId: string) {
    this.navCtrl.navigateForward(`/pago/${reservaId}`);
  }

}
