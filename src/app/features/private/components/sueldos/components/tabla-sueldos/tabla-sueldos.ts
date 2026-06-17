import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Dialog } from "primeng/dialog";
import { MisueldoModal } from "../../misueldo-modal/misueldo-modal";
import { Router } from '@angular/router';

interface BarberoFila {
  id?: number;
  nombre: string;
  iniciales: string;
  avatarColor: string;
  sueldoBase: number;
  ventas: number;
  porcentaje: number;
  comision: number;
  sueldoFinal: number;
}

@Component({
  selector: 'app-tabla-sueldos',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ButtonModule, Dialog, MisueldoModal],
  templateUrl: './tabla-sueldos.html',
  styleUrl: './tabla-sueldos.css',
})
export class TablaSueldos {

  constructor(private router: Router) {}

  barberos: BarberoFila[] = [
    {
      id: 1,
      nombre: 'Carlos Rivas',
      iniciales: 'CR',
      avatarColor: '#1a3a5c',
      sueldoBase: 2200,
      ventas: 42,
      porcentaje: 15,
      comision: 504,
      sueldoFinal: 2704,
    },
    {
      id: 2,
      nombre: 'Luis Torres',
      iniciales: 'LT',
      avatarColor: '#1a4a3a',
      sueldoBase: 2000,
      ventas: 35,
      porcentaje: 12,
      comision: 336,
      sueldoFinal: 2336,
    },
    {
        id: 3,
      nombre: 'Miguel Soto',
      iniciales: 'MS',
      avatarColor: '#3a2a1a',
      sueldoBase: 1800,
      ventas: 28,
      porcentaje: 10,
      comision: 224,
      sueldoFinal: 2024,
    },
    {
      id: 4,
      nombre: 'Jorge Paredes',
      iniciales: 'JP',
      avatarColor: '#2a1a3a',
      sueldoBase: 1740,
      ventas: 24,
      porcentaje: 10,
      comision: 192,
      sueldoFinal: 1932,
    },
    {
      id: 5,
      nombre: 'Andrés Campos',
      iniciales: 'AC',
      avatarColor: '#3a1a1a',
      sueldoBase: 1500,
      ventas: 19,
      porcentaje: 8,
      comision: 121.60,
      sueldoFinal: 1621.60,
    },
  ];

  mostrarModalSueldo = false;
  barberoSeleccionado: any = null;

  verDetalle(barbero: any): void {
  this.router.navigate([
    '/dashboard/admin/sueldos',
    barbero.id
  ]);
}

}