export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface Sucursal {
  id: string;
  nombre: string;
  ciudad: string;
  provincia: string;
  direccion: string;
  telefono: string;
  horario: string;
  coordenadas: Coordenadas;
}