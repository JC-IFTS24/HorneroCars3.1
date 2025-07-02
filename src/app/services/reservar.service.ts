import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ReservarService {

  reservas: Reserva[] = []; //array para guardar las reservas
  storageKey: string = 'reservas';//para guardar las reservas en el almacenamiento local de la app

  constructor() { 
    this.cargarReservas();
  }

  async cargarReservas() {
    const respuesta = await Preferences.get({key: this.storageKey});//traigo los datos del almacenamiento de la app
    this.reservas = respuesta.value ? JSON.parse(respuesta.value) : []; //si trae algo, lo parsea al formato original, sinó pasa un array vacío
  }

  //si no hay elementos en el array, invoca el método para traerlos del almacenamiento. luego lo devuelve
    async obtenerReservas(): Promise<Reserva[]> {
    if (this.reservas.length === 0) {
      await this.cargarReservas();
    }
    return this.reservas;
  }

  //guardo en el array una nueva reserva y luego guardo el array en el almacenamiento
  async agregarReserva(reserva: Reserva) {    
    this.reservas.push(reserva);


    // Agregar mock si no hay reservas
    // if (this.reservas.length === 0) {
    //   await this.agregarMockReservas();
    // }

    return this.reservas;
  }

  async guardarReservas(reservas: Reserva[]) {
    this.reservas = reservas;

    await Preferences.set({
      key: this.storageKey,
      value: JSON.stringify(this.reservas)
    });

  }


  // private async agregarMockReservas() {
  //   const mock: Reserva[] = [
  //     {
  //       reservaId: 'r001',
  //       userNombre: 'Juliana Perez',
  //       vehiculo: 'SUV',
  //       fechaInicio: '2025-07-01',
  //       fechaDevolucion: '2025-07-05',
  //       seguro: 'Completo',
  //       estado: 'Pagada',
  //       dias: 4,
  //       costoVehiculo: 80000,
  //       costoTotal: 92000,
  //     },
  //     {
  //       reservaId: 'r002',
  //       userNombre: 'Carlos Díaz',
  //       vehiculo: 'Sedan Confort',
  //       fechaInicio: '2025-07-10',
  //       fechaDevolucion: '2025-07-12',
  //       seguro: 'Básico',
  //       estado: 'Confirmada - Pendiente de Pago',
  //       dias: 2,
  //       costoVehiculo: 40000,
  //       costoTotal: 44000,
  //     },
  //     {
  //       reservaId: 'r003',
  //       userNombre: 'Luis Romero',
  //       vehiculo: 'SUV',
  //       fechaInicio: '2025-06-15',
  //       fechaDevolucion: '2025-06-20',
  //       seguro: 'Completo',
  //       estado: 'Cancelada',
  //       dias: 5,
  //       costoVehiculo: 120000,
  //       costoTotal: 138000,
  //     },
  //     {
  //       reservaId: 'r004',
  //       userNombre: 'María López',
  //       vehiculo: 'SUV',
  //       fechaInicio: '2025-08-01',
  //       fechaDevolucion: '2025-08-07',
  //       seguro: 'Básico',
  //       estado: 'Confirmada - Pendiente de Pago',
  //       dias: 6,
  //       costoVehiculo: 70000,
  //       costoTotal: 77000,
  //     },
  //     {
  //       reservaId: 'r005',
  //       userNombre: 'Ana Torres',
  //       vehiculo: 'Lujo',
  //       fechaInicio: '2025-09-05',
  //       fechaDevolucion: '2025-09-09',
  //       seguro: 'Completo',
  //       estado: 'Pagada',
  //       dias: 4,
  //       costoVehiculo: 95000,
  //       costoTotal: 109250,
  //     },
  //     {
  //       reservaId: 'r006',
  //       userNombre: 'Juan Pablo',
  //       vehiculo: 'Utilitario',
  //       fechaInicio: '2025-10-12',
  //       fechaDevolucion: '2025-10-15',
  //       seguro: 'Básico',
  //       estado: 'Pagada',
  //       dias: 3,
  //       costoVehiculo: 30000,
  //       costoTotal: 33000,
  //     },
  //     {
  //       reservaId: 'r007',
  //       userNombre: 'Carla Mendez',
  //       vehiculo: 'Lujo',
  //       fechaInicio: '2025-11-01',
  //       fechaDevolucion: '2025-11-03',
  //       seguro: 'Completo',
  //       estado: 'Confirmada - Pendiente de Pago',
  //       dias: 2,
  //       costoVehiculo: 120000,
  //       costoTotal: 138000,
  //     },
  //     {
  //       reservaId: 'r008',
  //       userNombre: 'Martin Rodríguez',
  //       vehiculo: 'Utilitario',
  //       fechaInicio: '2025-12-15',
  //       fechaDevolucion: '2025-12-20',
  //       seguro: 'Completo',
  //       estado: 'Cancelada',
  //       dias: 5,
  //       costoVehiculo: 130000,
  //       costoTotal: 149500,
  //     },
  //     {
  //       reservaId: 'r009',
  //       userNombre: 'Sofía Rivas',
  //       vehiculo: 'SUV',
  //       fechaInicio: '2025-07-20',
  //       fechaDevolucion: '2025-07-25',
  //       seguro: 'Básico',
  //       estado: 'Pagada',
  //       dias: 5,
  //       costoVehiculo: 60000,
  //       costoTotal: 66000,
  //     },
  //     {
  //       reservaId: 'r010',
  //       userNombre: 'Esteban Gutiérrez',
  //       vehiculo: 'Económico',
  //       fechaInicio: '2025-07-28',
  //       fechaDevolucion: '2025-07-30',
  //       seguro: 'Completo',
  //       estado: 'Confirmada - Pendiente de Pago',
  //       dias: 2,
  //       costoVehiculo: 150000,
  //       costoTotal: 172500,
  //     }
  //   ];

  //   this.reservas = mock;

  //   await Preferences.set({
  //     key: this.storageKey,
  //     value: JSON.stringify(mock)
  //   });

  // }
}


