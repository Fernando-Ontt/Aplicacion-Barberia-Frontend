import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ResumenadminService } from '@/app/core/services/gestion/resumen-admin.service';
import { DashboardData } from '@/app/core/models/gestion/admin/resumen-admin';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface KpiMetrica {
  icon: string;
  label: string;
  value: string;
  sub: string;
  porcentaje: number;
  deltaPositivo: boolean;
}

@Component({
  selector: 'app-metricas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './metricas.html',
  // ✅ Sin styleUrl — todo el estilo va en Tailwind dentro del HTML
})
export class MetricasComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('ventasChart')    ventasRef!:    ElementRef<HTMLCanvasElement>;
  @ViewChild('reservasChart')  reservasRef!:  ElementRef<HTMLCanvasElement>;
  @ViewChild('barberosChart')  barberosRef!:  ElementRef<HTMLCanvasElement>;
  @ViewChild('serviciosChart') serviciosRef!: ElementRef<HTMLCanvasElement>;

  private resumenSvc = inject(ResumenadminService);
  private destroy$   = new Subject<void>();
  private charts: Chart[] = [];

  fechaInicio = '';
  fechaFin    = '';
  cargando    = true;
  error       = '';
  kpis: KpiMetrica[] = [];

  private rawData: DashboardData | null = null;

  ngOnInit(): void {
    const hoy    = new Date();
    const hace30 = new Date();
    hace30.setDate(hoy.getDate() - 30);
    this.fechaFin    = hoy.toISOString().split('T')[0];
    this.fechaInicio = hace30.toISOString().split('T')[0];
    this.cargarDatos();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
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
          this.rawData = data;
          this.construirKpis(data);
          this.cargando = false;
          setTimeout(() => this.inicializarGraficas(), 80);
        },
        error: (err) => {
          console.error(err);
          this.error    = 'No se pudieron cargar las métricas. Verifica la conexión.';
          this.cargando = false;
        }
      });
  }

  aplicarFiltros(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      this.error = 'Seleccione un rango de fechas válido.';
      return;
    }
    this.charts.forEach(c => c.destroy());
    this.charts = [];
    this.cargarDatos();
  }

  // ─────────────────────────────────────────────
  //  KPIs
  // ─────────────────────────────────────────────
  private construirKpis(data: DashboardData): void {
    this.kpis = [
      {
        icon: 'dollar',
        label: 'Ingresos totales',
        value: `S/ ${(data as any)?.totalIngresos?.toFixed(2) ?? '0.00'}`,
        sub: 'En el período seleccionado',
        porcentaje: (data as any)?.crecimientoIngresos ?? 0,
        deltaPositivo: ((data as any)?.crecimientoIngresos ?? 0) >= 0,
      },
      {
        icon: 'calendar',
        label: 'Reservas totales',
        value: String((data as any)?.totalReservas ?? 0),
        sub: `Completadas: ${(data as any)?.reservasCompletadas ?? 0}`,
        porcentaje: (data as any)?.crecimientoReservas ?? 0,
        deltaPositivo: ((data as any)?.crecimientoReservas ?? 0) >= 0,
      },
      {
        icon: 'users',
        label: 'Clientes activos',
        value: String((data as any)?.totalClientes ?? 0),
        sub: `Nuevos: ${(data as any)?.clientesNuevos ?? 0}`,
        porcentaje: (data as any)?.crecimientoClientes ?? 0,
        deltaPositivo: ((data as any)?.crecimientoClientes ?? 0) >= 0,
      },
      {
        icon: 'tag',
        label: 'Ticket promedio',
        value: `S/ ${(data as any)?.ticketPromedio?.toFixed(2) ?? '0.00'}`,
        sub: 'Por venta realizada',
        porcentaje: (data as any)?.crecimientoTicket ?? 0,
        deltaPositivo: ((data as any)?.crecimientoTicket ?? 0) >= 0,
      },
    ];
  }

  // ─────────────────────────────────────────────
  //  GRÁFICAS
  // ─────────────────────────────────────────────
  private inicializarGraficas(): void {
    const data      = this.rawData as any;
    const dorado    = '#C9A84C';
    const alfa      = 'rgba(201,168,76,0.15)';
    const tickColor = 'rgba(255,255,255,0.4)';
    const gridColor = 'rgba(255,255,255,0.05)';

    const escalaBase = {
      x: { ticks: { color: tickColor }, grid: { color: gridColor } },
      y: { ticks: { color: tickColor }, grid: { color: gridColor } },
    };
    const legend = {
      labels: { color: 'rgba(255,255,255,0.55)', font: { size: 11 } },
    };

    // ─ Ingresos diarios (línea)
    if (this.ventasRef) {
      const labels  = data?.ventasPorDia?.map((v: any) => v.dia)  ?? ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
      const valores = data?.ventasPorDia?.map((v: any) => v.monto) ?? [520, 580, 610, 730, 850, 400, 310];

      this.charts.push(new Chart(this.ventasRef.nativeElement, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Ingresos (S/)',
            data: valores,
            borderColor: dorado,
            backgroundColor: alfa,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: dorado,
            pointRadius: 4,
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: escalaBase,
        },
      }));
    }

    // ─ Reservas por día (barras agrupadas)
    if (this.reservasRef) {
      const labels      = data?.reservasPorDia?.map((r: any) => r.dia)         ?? ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
      const completadas = data?.reservasPorDia?.map((r: any) => r.completadas) ?? [40, 45, 42, 54, 62, 48, 25];
      const canceladas  = data?.reservasPorDia?.map((r: any) => r.canceladas)  ?? [5, 7, 6, 7, 8, 7, 5];

      this.charts.push(new Chart(this.reservasRef.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Completadas', data: completadas, backgroundColor: dorado,    borderRadius: 4, borderSkipped: false },
            { label: 'Canceladas',  data: canceladas,  backgroundColor: '#7f1d1d', borderRadius: 4, borderSkipped: false },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend },
          scales: escalaBase,
        },
      }));
    }

    // ─ Rendimiento por barbero (barras horizontales)
    if (this.barberosRef) {
      const labels  = data?.rendimientoBarberos?.map((b: any) => b.nombre)    ?? ['Carlos','Miguel','Luis','Pedro','Andrés'];
      const valores = data?.rendimientoBarberos?.map((b: any) => b.servicios) ?? [45, 38, 52, 29, 41];

      this.charts.push(new Chart(this.barberosRef.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Servicios realizados',
            data: valores,
            backgroundColor: ['#C9A84C','#a88430','#8a6c25','#6e551d','#523f15'],
            borderRadius: 4,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y' as const,
          plugins: { legend: { display: false } },
          scales: escalaBase,
        },
      }));
    }

    // ─ Servicios más solicitados (donut)
    if (this.serviciosRef) {
      const labels  = data?.serviciosPopulares?.map((s: any) => s.nombre)   ?? ['Corte clásico','Corte + barba','Degradado','Barba','Tratamiento'];
      const valores = data?.serviciosPopulares?.map((s: any) => s.cantidad) ?? [35, 28, 20, 12, 5];

      this.charts.push(new Chart(this.serviciosRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: valores,
            backgroundColor: ['#C9A84C','#d4b05e','#dfc070','#e9d088','#f3e0a0'],
            borderWidth: 0,
            hoverOffset: 8,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { ...legend, position: 'bottom' } },
        },
      }));
    }
  }
}