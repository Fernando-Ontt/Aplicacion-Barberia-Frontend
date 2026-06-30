import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservaService } from '@/app/core/services/operaciones/reserva.service';
import {
  HistorialClienteModel
} from '@/app/core/models/operaciones/historial-cliente.model';
import { HistorialClienteFiltro } from '@/app/core/models/operaciones/historial-cliente.model';

import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { FiltrosComponent } from '@/app/shared/components/filtros/filtros.component';
import { FILTROS_HISTORIAL } from '@/app/core/config/filtros.config';

// PrimeNG
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-cliente-historial',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    DialogModule,
    ProgressSpinnerModule,
    TooltipModule,
    StatusBadgeComponent,
    FiltrosComponent
  ],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class ClienteHistorialComponent implements OnInit {

  private reservaService = inject(ReservaService);

  historial: HistorialClienteModel[] = [];
  totalRecords = 0;
  loading = true;

  currentPage = 0;
  pageSize = 10;

  filtrosFields = [...FILTROS_HISTORIAL];
  filtros: HistorialClienteFiltro = {};

  displayModal = false;
  reservaSeleccionada: HistorialClienteModel | null = null;

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.loading = true;

    this.reservaService.getHistorialCliente(
      this.currentPage,
      this.pageSize,
      this.filtros.estado,
      this.filtros.desde,
      this.filtros.hasta
    ).subscribe({
      next: (response) => {
        this.historial = response.data.content;
        this.totalRecords = response.data.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el historial', err);
        this.loading = false;
      }
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.currentPage = Math.floor((event.first ?? 0) / (event.rows ?? 10));
    this.pageSize = event.rows ?? 10;
    this.cargarHistorial();
  }

  onBuscar(filtros: HistorialClienteFiltro): void {
    this.filtros = filtros;
    this.currentPage = 0;
    this.cargarHistorial();
  }

  onLimpiar(): void {
    this.filtros = {};
    this.currentPage = 0;
    this.cargarHistorial();
  }

  verDetalle(reserva: HistorialClienteModel): void {
    this.reservaSeleccionada = reserva;
    this.displayModal = true;
  }
}