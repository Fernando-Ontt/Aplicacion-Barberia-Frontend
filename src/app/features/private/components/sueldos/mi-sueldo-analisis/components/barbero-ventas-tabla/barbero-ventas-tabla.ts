import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaBarbero, ResumenBarbero } from '@core/models/planilla/venta-barbero.model';

@Component({
  selector: 'app-barbero-ventas-tabla',
  imports: [CommonModule],
  templateUrl: './barbero-ventas-tabla.html',
  styleUrl: './barbero-ventas-tabla.css',
})
export class BarberoVentasTabla implements OnChanges {
  @Input() ventas: VentaBarbero[] = [];
  @Input() resumen!: ResumenBarbero;
  @Input() page: number = 0;
  @Input() size: number = 20;
  @Input() totalElements: number = 0;
  @Input() totalPages: number = 0;

  @Output() paginaCambiada = new EventEmitter<number>();

  readonly Math = Math;

  ngOnChanges(): void {}

  get paginaActual(): number {
    return this.page + 1;
  }

  get desde(): number {
    return this.totalElements === 0 ? 0 : this.page * this.size + 1;
  }

  get hasta(): number {
    return Math.min((this.page + 1) * this.size, this.totalElements);
  }
}