import { TipoReserva } from "./TipoRserva";
import { EstadoReserva } from './EstadoReserva';

export interface Reserva{
    id: number;
    reservaId: number;
    clienteNombre: string;
    barberoNombre: string;
    servicio: string;
    fecha: Date;
    horaInicio: Date;
    horaFin: Date;
    tipoReserva: TipoReserva;
    total: number;
    estadoReserva: EstadoReserva;
}