export interface Vehiculo {

    vehiculoId: number;
    marca: string;
    modelo: string;
    categoria: string;
    descripcionCorta: string;
    precioDia: number;
    imagen: string;
    disponible: boolean;
    caracteristicas: {
        puertas: number;
        plazas: number;
        transmision: string;
        maletero: string;
        grupo: string;
        matricula: string;
    };    
    tags: string[];
    requisitos: {
        edadMinima: number;
    };
}