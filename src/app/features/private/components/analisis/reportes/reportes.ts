import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ResumenadminService } from '@/app/core/services/gestion/resumen-admin.service';
import { DashboardData } from '@/app/core/models/gestion/admin/resumen-admin';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface FilaSemanal {
  dia: string;
  reservas: number;
  completadas: number;
  canceladas: number;
  ingresos: number;
}

interface ReporteItem {
  icon: string;
  titulo: string;
  descripcion: string;
  tipo: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './reportes.html',
  // ✅ Sin styleUrl — todo el estilo va en Tailwind dentro del HTML
})
export class ReportesComponent implements OnInit, OnDestroy {

  private resumenSvc = inject(ResumenadminService);
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

    this.resumenSvc
      .getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: DashboardData) => {
          const raw = data as any;
          this.resumenSemanal = raw?.resumenSemanal ?? this.mockSemanal();
          this.calcularTotales();
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'No se pudo cargar el resumen semanal. Verifica la conexión.';
          // Fallback mock para no romper la UI en desarrollo
          this.resumenSemanal = this.mockSemanal();
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
    const doc     = new jsPDF();
    const periodo = `${this.fechaInicio} al ${this.fechaFin}`;

    // Cabecera FadeX
    doc.setFillColor(13, 13, 13);
    doc.rect(0, 0, 220, 42, 'F');
    doc.setTextColor(201, 168, 76);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FadeX — Barbería', 14, 18);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Reporte: ${this.labelTipo(tipo)}`, 14, 28);
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.text(`Período: ${periodo}`, 14, 36);

    if (tipo === 'reservas' || tipo === 'ventas') {
      autoTable(doc, {
        startY: 50,
        head: [['Día', 'Reservas', 'Completadas', 'Canceladas', 'Ingresos (S/)']],
        body: this.resumenSemanal.map(f => [
          f.dia, f.reservas, f.completadas, f.canceladas,
          `S/ ${f.ingresos.toFixed(2)}`,
        ]),
        foot: [[
          'TOTAL',
          this.totalReservas,
          this.totalCompletadas,
          this.totalCanceladas,
          `S/ ${this.totalIngresos.toFixed(2)}`,
        ]],
        headStyles: { fillColor: [201, 168, 76], textColor: [0, 0, 0], fontStyle: 'bold' },
        footStyles: { fillColor: [40, 40, 40], textColor: [201, 168, 76], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [25, 25, 25] },
        bodyStyles: { fillColor: [18, 18, 18], textColor: [200, 200, 200] },
        styles: { fontSize: 10, cellPadding: 5 },
      });
    } else {
      autoTable(doc, {
        startY: 50,
        head: [['Sin datos detallados para este reporte']],
        body: [['Contacte al administrador del sistema']],
        headStyles: { fillColor: [201, 168, 76], textColor: [0, 0, 0] },
        bodyStyles: { fillColor: [18, 18, 18], textColor: [200, 200, 200] },
      });
    }

    doc.save(`fadex-${tipo}-${this.fechaInicio}.pdf`);
    this.exportando = '';
  }

  // ─────────────────────────────────────────────
  //  EXPORTAR EXCEL
  // ─────────────────────────────────────────────
  exportarExcel(tipo: string): void {
    this.exportando = `${tipo}-excel`;
    const wb = XLSX.utils.book_new();
    let filas: any[][];

    if (tipo === 'reservas' || tipo === 'ventas') {
      filas = [
        [`FadeX — Reporte de ${this.labelTipo(tipo)}`],
        [`Período: ${this.fechaInicio} al ${this.fechaFin}`],
        [],
        ['Día', 'Reservas', 'Completadas', 'Canceladas', 'Ingresos (S/)'],
        ...this.resumenSemanal.map(f => [
          f.dia, f.reservas, f.completadas, f.canceladas, f.ingresos,
        ]),
        [],
        ['TOTAL', this.totalReservas, this.totalCompletadas,
         this.totalCanceladas, this.totalIngresos],
      ];
    } else {
      filas = [
        [`FadeX — Reporte de ${this.labelTipo(tipo)}`],
        [`Período: ${this.fechaInicio} al ${this.fechaFin}`],
        [],
        ['Sin datos detallados disponibles para este reporte'],
      ];
    }

    const ws = XLSX.utils.aoa_to_sheet(filas);
    XLSX.utils.book_append_sheet(wb, ws, tipo);
    XLSX.writeFile(wb, `fadex-${tipo}-${this.fechaInicio}.xlsx`);
    this.exportando = '';
  }

  // ─────────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────────
  private calcularTotales(): void {
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

  private mockSemanal(): FilaSemanal[] {
    return [
      { dia: 'Lunes',     reservas: 45, completadas: 40, canceladas: 5, ingresos: 520 },
      { dia: 'Martes',    reservas: 52, completadas: 45, canceladas: 7, ingresos: 580 },
      { dia: 'Miércoles', reservas: 48, completadas: 42, canceladas: 6, ingresos: 610 },
      { dia: 'Jueves',    reservas: 61, completadas: 54, canceladas: 7, ingresos: 730 },
      { dia: 'Viernes',   reservas: 70, completadas: 62, canceladas: 8, ingresos: 850 },
      { dia: 'Sábado',    reservas: 55, completadas: 48, canceladas: 7, ingresos: 680 },
      { dia: 'Domingo',   reservas: 30, completadas: 25, canceladas: 5, ingresos: 310 },
    ];
  }
}