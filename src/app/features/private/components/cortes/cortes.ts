import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Reservas } from '@/app/core/services/reserva/reserva';

export interface ServicioHistorialDTO {
  idReserva: number;
  nombreCliente: string;
  apellidoCliente: string;
  telefonoCliente: string;
  nombreCorte: string;
  fecha: string;
  horaInicio: string;
  duracion: number;
  precio: number;
  estado: string;
}

@Component({
  selector: 'app-cortes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    DecimalPipe,
    ButtonModule,
    TableModule,
  ],
  templateUrl: './cortes.html',
  styleUrl: './cortes.css',
})
export class CortesComponent implements OnInit {

  private readonly reservasService = inject(Reservas);

  servicios: ServicioHistorialDTO[] = [];
  serviciosFiltrados: ServicioHistorialDTO[] = [];
  cargando = false;

  filtros = {
    cliente: '',
    fechaDesde: '',
    fechaHasta: ''
  };

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando = true;
    this.reservasService.getHistorialServicios().subscribe({
      next: (data: ServicioHistorialDTO[]) => {
        this.servicios = [...data].sort((a, b) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => {
        this.servicios = [];
        this.serviciosFiltrados = [];
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.serviciosFiltrados = this.servicios.filter(s => {
      const nombreCompleto = `${s.nombreCliente} ${s.apellidoCliente}`.toLowerCase();

      const okCliente = !this.filtros.cliente ||
        nombreCompleto.includes(this.filtros.cliente.toLowerCase());

      const fechaServicio = new Date(s.fecha).getTime();

      const okDesde = !this.filtros.fechaDesde ||
        fechaServicio >= new Date(this.filtros.fechaDesde + 'T00:00:00').getTime();

      const okHasta = !this.filtros.fechaHasta ||
        fechaServicio <= new Date(this.filtros.fechaHasta + 'T23:59:59').getTime();

      return okCliente && okDesde && okHasta;
    });
  }

  get hayFiltrosActivos(): boolean {
    return !!(this.filtros.cliente || this.filtros.fechaDesde || this.filtros.fechaHasta);
  }

  limpiarFiltros(): void {
    this.filtros = { cliente: '', fechaDesde: '', fechaHasta: '' };
    this.aplicarFiltros();
  }
  onFechaDesdeChange(): void {
    // Si "hasta" es anterior a la nueva fecha "desde", la limpiamos
    if (this.filtros.fechaHasta && this.filtros.fechaHasta < this.filtros.fechaDesde) {
      this.filtros.fechaHasta = '';
    }
    this.aplicarFiltros();
  }
}