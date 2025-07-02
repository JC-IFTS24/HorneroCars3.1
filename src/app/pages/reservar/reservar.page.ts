import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validator } from '@angular/forms';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';
import { Reserva } from 'src/app/models/reserva.model';
import { ReservarService } from 'src/app/services/reservar.service';
import { Router } from '@angular/router';

import { UrlSeguraPipe } from 'src/app/pipes/url-segura.pipe';
import { Sucursal } from 'src/app/models/sucursal.model';
import { lastValueFrom } from 'rxjs';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, UrlSeguraPipe]
})
export class ReservarPage {

  formReserva: FormGroup; //Defino el form
  reservaNueva?: Reserva;

  //variables geolocalizacion//
  rutaSucursales = 'assets/data/sucursales.json'//ruta al json con las sucursales para traer latitud y longitud.
  sucursales: Sucursal[] = [];
  lat?: number;
  long?: number;
  errorMensaje?: string | null = null;
  nombreSucursalCercana: string | undefined = undefined;
  urlGoogleMaps: string | null = null;

  //Inyecto el form builder y luego instancio el formulario de reserva
  constructor(private _formBuilder: FormBuilder, private _reservarService: ReservarService, private _router: Router,
    private _httpClient: HttpClient) {
    this.formReserva = this._formBuilder.group({
      userNombre: ['', [Validators.required, Validators.minLength(3)]],
      vehiculo: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaDevolucion: ['', [Validators.required]],

    });
    this.cargarSucursales()
    //agrego el ícono de IonicIcons
    addIcons({
      calendarOutline,
    })
  }

  submitForm() {
    if (this.formReserva.invalid) {
      this.formReserva.markAllAsTouched();//si alguna parte es invalida, marca todas las casillas y muestra los errores
    } else {
      this.guardarReserva();
      console.log(this.formReserva.value);

      this.formReserva.reset();
      alert('Reserva completada con éxito.');
      this._router.navigate(['/mis-reservas']);
    }

  }

  //método para comprobar errores en los controles del form segun el validator y si la casilla ha sido tocada.
  //ya no es necesario, la propiedad errorText de ionic cumple la misma funcion
  hayErrores(controlName: string, validator: string) {
    const control = this.formReserva.get(controlName);
    const hayErrores = this.formReserva.get(controlName)?.hasError(validator) && this.formReserva.get(controlName)?.touched;

    return hayErrores;
  }

  //llamo al servicio para guardar la reserva
  async guardarReserva() {
    if (this.formReserva.invalid) {
      return;
    }
    //obtengo los datos del formulario y se los paso al metodo agregarReserva del servicio
    const reservaId = new Date().toString();
    const userNombre = this.formReserva.get('userNombre')?.value;
    const vehiculo = this.formReserva.get('vehiculo')?.value;
    const fechaInicio = this.formReserva.get('fechaInicio')?.value;
    const fechaDevolucion = this.formReserva.get('fechaDevolucion')?.value;
    const estado = 'Pendiente de Pago';
    await this._reservarService.agregarReserva({
      reservaId: reservaId,
      userNombre: userNombre,
      vehiculo: vehiculo,
      fechaInicio: fechaInicio,
      fechaDevolucion: fechaDevolucion,
      estado: estado,
    });
    console.log('Reserva guardada en el almacenamiento de la app')
  }

  volverAHome() {
    this._router.navigate(['/home'])
  }

  irAMisReservas() {
    if (this.formReserva.invalid) {
      return;
    }
    this._router.navigate(['/mis-reservas'])
  }

  //Geoloca 2

  // limpio las variables  
  
  //--Geolocalizacion - copio el servicio--//
  private async otorgaPermisoDeUbicacion(): Promise<boolean> {
    console.log('Pidiendo permiso...');
    const permisos = await Geolocation.checkPermissions();

    //Si está concedido devuelve true
    if (permisos.location === 'granted') return true;

    //Si no, pide permiso al usuario
    const solicitud: PermissionStatus = await Geolocation.requestPermissions();

    return solicitud.location === 'granted';
  }

  async obtenerPosicionActual() {
    console.log('Obteniendo posicion actual...')
    try {
      const otorgaPermiso = await this.otorgaPermisoDeUbicacion();

      //si el usuario no otorga el permiso
      if (!otorgaPermiso) {
        this.errorMensaje = 'Permiso de ubicacion denegado';
        this.lat = undefined;
        this.long = undefined;
        return;
      }
      //si otorga permiso, se obtiene la ubicacion y se asigna a las variables
      const ubicacion = await Geolocation.getCurrentPosition();
      this.lat = ubicacion.coords.latitude;
      this.long = ubicacion.coords.longitude;

      this.errorMensaje = undefined; //borramos el error
    } catch (err) {//en caso de error, se lo asigno a la variable
      this.errorMensaje = "Error obteniendo ubicacion: " + (err as any).message
    }
  }

  //carga y comparacion con las sucursales

  //cargo las sucursales
  async cargarSucursales(): Promise<void> {
    if (this.sucursales.length > 0) {
      console.log('Sucursales ya cargadas. Evitando recarga.');
      return;
    }
    try {
      // lastValueFrom convierte un observable en una promise
      this.sucursales = await lastValueFrom(
        this._httpClient.get<Sucursal[]>(this.rutaSucursales)
      );
      console.log('Sucursales cargadas exitosamente:', this.sucursales);
    } catch (error) {
      console.error('Error al cargar las sucursales:', error);
      this.errorMensaje = 'Error al cargar las sucursales.';
    }
  }

  //uso la diferencia de los cuadrados(a² - b² = (a + b)(a - b)) para calcular la distancia entre el usuario y las sucursales
  private calcularDistanciaSucursalUsuario(lat1: number, long1: number, lat2: number, long2: number): number {
    const distanciaLat = lat2 - lat1;
    const distanciaLong = long2 - long1;

    return (distanciaLat * distanciaLat) + (distanciaLong * distanciaLong);
  }

  //encuentro la sucursal mas cercana al usuario con if anidados
  getSucursalMasCercana(): Sucursal | null {
    //error si no se pudo obtener la ubicacion del usuario
    if (this.lat === undefined || this.long === undefined) {
      this.errorMensaje = 'No se pudo obtener la ubicación actual del usuario.';
      return null;
    }
    //error si las sucursales no se pudieron cargar previamente
    if (this.sucursales.length === 0) {
      this.errorMensaje = 'No hay sucursales cargadas para comparar. Asegúrate de llamar a cargarSucursales().';
      return null;
    }

    let sucursalMasCercana: Sucursal | null = null;
    //para la primer sucursal, valor de referencia por si es la sucursal mas cercana
    //cualquier distancia va a ser menor a infinito
    let distanciaMinima = Infinity;

    // uso la funcion definida antes para cada sucursal
    for (const sucursal of this.sucursales) {
      const distancia = this.calcularDistanciaSucursalUsuario(
        this.lat,
        this.long,
        sucursal.coordenadas.lat,
        sucursal.coordenadas.lng
      );
      //comparo la primer sucursal con infinito, y se reemplaza el resultado
      if (distancia < distanciaMinima) {
        distanciaMinima = distancia;
        sucursalMasCercana = sucursal;
      }
    }

    //si el valor encuentra una sucursal válida
    if (sucursalMasCercana) {
      // distancia como valor de comparacion, no km reales, con 4 decimales
      console.log(`La sucursal más cercana es: ${sucursalMasCercana.nombre} (distancia comparativa: ${distanciaMinima.toFixed(4)})`);
    } else {
      this.errorMensaje = 'No se encontró ninguna sucursal cercana válida.';
    }

    this.nombreSucursalCercana = sucursalMasCercana?.nombre;
    return sucursalMasCercana;
  }

  //genero la url para la sucursal mas cercana al usuario
  get googleMapsUrl(): string | null {
    const sucursal = this.getSucursalMasCercana();

    //si se encontró la sucursal mas cercana, obtengo las coordenadas
    //sino devuelve null
    if (sucursal) {
      this.lat = sucursal.coordenadas.lat;
      this.long = sucursal.coordenadas.lng;

      return this.lat !== undefined && this.long !== undefined ? `https://www.google.com/maps?q=${this.lat},${this.long}&hl=es&z=15&output=embed` : null;
    }
    return null;
  }

  ocultarMapa() {    
    const mapa = document.getElementById('mapa-iframe');
    const botonObtener = document.getElementById('obtenerPosicion');
    const botonOcultar = document.getElementById('ocultarMapa');
    if (mapa && botonObtener && botonOcultar) {
      mapa.remove();
      botonObtener.remove();
      botonOcultar.remove();
      this.limpiarMensajes();
    }
  }

  private limpiarMensajes() {
    this.errorMensaje = null;
    this.nombreSucursalCercana = undefined;
    this.urlGoogleMaps = null;
  }

}
