import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BarberoDato {
  nombre: string;
  sueldoBase: number;
  comision: number;
}

@Component({
  selector: 'app-grafico-sueldos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico-sueldos.html',
  styleUrl: './grafico-sueldos.css',
})
export class GraficoSueldos {

  barberos: BarberoDato[] = [
    { nombre: 'Carlos', sueldoBase: 2200, comision: 504 },
    { nombre: 'Luis',   sueldoBase: 2000, comision: 336 },
    { nombre: 'Miguel', sueldoBase: 1800, comision: 224 },
    { nombre: 'Jorge',  sueldoBase: 1740, comision: 192 },
    { nombre: 'Andrés', sueldoBase: 1500, comision: 121.60 },
  ];

  get maxValor(): number {
    const max = Math.max(...this.barberos.map(b => b.sueldoBase + b.comision));
    return Math.ceil(max / 500) * 500;
  }
}