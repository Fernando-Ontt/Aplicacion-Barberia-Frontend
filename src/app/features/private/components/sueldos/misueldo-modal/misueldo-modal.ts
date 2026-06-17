import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface VentaDetalle {
  fecha: string;
  totalVenta: number;
  porcentaje: number;
  ganancia: number;
}

@Component({
  selector: 'app-misueldo-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './misueldo-modal.html',
  styleUrl: './misueldo-modal.css',
})
export class MisueldoModal {

  @Input() barbero: any;

  ventas: VentaDetalle[] = [
    {
      fecha: '12/06/2026',
      totalVenta: 45,
      porcentaje: 15,
      ganancia: 6.75
    },
    {
      fecha: '12/06/2026',
      totalVenta: 80,
      porcentaje: 15,
      ganancia: 12
    },
    {
      fecha: '13/06/2026',
      totalVenta: 120,
      porcentaje: 15,
      ganancia: 18
    },
    {
      fecha: '14/06/2026',
      totalVenta: 65,
      porcentaje: 15,
      ganancia: 9.75
    }
  ];

  get totalFacturado(): number {
  return this.ventas.reduce(
    (acc, venta) => acc + venta.totalVenta,
    0
  );
}

get totalGanancia(): number {
  return this.ventas.reduce(
    (acc, venta) => acc + venta.ganancia,
    0
  );
}

}