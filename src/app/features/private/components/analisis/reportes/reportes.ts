import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ReporteService } from '@/app/core/services/analisis/reporte.service';
import { FilaSemanal, ReporteItem } from '@/app/core/models/analisis/reporte.model';



@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './reportes.html',
})
export class ReportesComponent implements OnInit, OnDestroy {

 private reporteSvc = inject(ReporteService);
  private destroy$   = new Subject<void>();

  fechaInicio  = '';
  fechaFin     = '';
  cargando     = true;
  exportando   = '';
  error        = '';

  resumenSemanal: FilaSemanal[] = [];
  totalReservas    = 0;
  totalCompletadas = 0;
  totalCanceladas  = 0;
  totalIngresos    = 0;

  reportes: ReporteItem[] = [
    { icon: 'calendar', titulo: 'Reservas',              descripcion: 'Reporte detallado de todas las reservas',  tipo: 'reservas' },
    { icon: 'dollar',   titulo: 'Ventas e ingresos',     descripcion: 'Análisis de ingresos y transacciones',     tipo: 'ventas'   },
    { icon: 'users',    titulo: 'Clientes',               descripcion: 'Base de datos y estadísticas de clientes', tipo: 'clientes' },
    { icon: 'wrench',   titulo: 'Actividad de barberos',  descripcion: 'Rendimiento y métricas del equipo',        tipo: 'barberos' },
  ];

  ngOnInit(): void {
    const hoy   = new Date();
    const hace7 = new Date();
    hace7.setDate(hoy.getDate() - 7);
    this.fechaFin    = hoy.toISOString().split('T')[0];
    this.fechaInicio = hace7.toISOString().split('T')[0];
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos(): void {
  this.cargando = true;
  this.error    = '';

  this.reporteSvc
    .getResumenSemanal(this.fechaInicio, this.fechaFin)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.resumenSemanal = data;
        this.calcularTotales();
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar el resumen semanal.';
        this.resumenSemanal = [];
        this.calcularTotales();
        this.cargando = false;
      },
    });
}

  aplicarFiltros(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      this.error = 'Seleccione un rango de fechas válido.';
      return;
    }
    this.cargarDatos();
  }

  // ─────────────────────────────────────────────
  //  EXPORTAR PDF
  // ─────────────────────────────────────────────
exportarPDF(tipo: string): void {
  this.exportando = `${tipo}-pdf`;
  this.reporteSvc.descargarArchivo(tipo, 'pdf', this.fechaInicio, this.fechaFin)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tipo}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.exportando = '';
      },
      error: () => {
        this.error = 'Error al descargar el PDF.';
        this.exportando = '';
      }
    });
}

  // ─────────────────────────────────────────────
  //  EXPORTAR EXCEL
  // ─────────────────────────────────────────────
exportarExcel(tipo: string): void {
  this.exportando = `${tipo}-excel`;
  this.reporteSvc.descargarArchivo(tipo, 'excel', this.fechaInicio, this.fechaFin)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tipo}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        this.exportando = '';
      },
      error: () => {
        this.error = 'Error al descargar el Excel.';
        this.exportando = '';
      }
    });
}

  // ─────────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────────
calcularTotales(): void {
  this.totalReservas    = this.resumenSemanal.reduce((s, f) => s + f.reservas,    0);
  this.totalCompletadas = this.resumenSemanal.reduce((s, f) => s + f.completadas, 0);
  this.totalCanceladas  = this.resumenSemanal.reduce((s, f) => s + f.canceladas,  0);
  this.totalIngresos    = this.resumenSemanal.reduce((s, f) => s + f.ingresos,    0);
}

  private labelTipo(tipo: string): string {
    const map: Record<string, string> = {
      reservas: 'Reservas',
      ventas:   'Ventas e Ingresos',
      clientes: 'Clientes',
      barberos: 'Actividad de Barberos',
    };
    return map[tipo] ?? tipo;
  }


  }
