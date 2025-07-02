import { Vehiculo } from "./vehiculo.model";

export interface Reserva {


    reservaId: string;
    userNombre: string;
    vehiculo: 'Sedan Confort' | 'Económico' | 'SUV' | 'Utilitario' | 'Lujo';
    fechaInicio: Date;
    fechaDevolucion: Date;
    estado: string;

    /*reservaId: string;                
    userNombre: string;            
    vehiculo: 'Sedan Confort' | 'Económico' | 'SUV' | 'Utilitario' | 'Lujo'; 
    fechaInicio: string;         
    fechaDevolucion: string;        
    seguro: 'Básico' | 'Completo' | 'Ninguno'; 
    estado: 'Confirmada - Pendiente de Pago' | 'Pagada' | 'En Curso' | 'Finalizada' | 'Cancelada'; 
    dias: number;                   
    costoVehiculo: number;         
    costoTotal: number;*/


}