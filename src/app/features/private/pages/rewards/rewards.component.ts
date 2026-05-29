import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RecompensaState {
  idCliente: number;
  cortesAcumulados: number;
  meta: number;
  cortesGratis: number;
  faltantes: number;
  recompensaDisponible: boolean;
}

interface HistorialItem {
  tipo: string;
  fecha: string;
  gratis: boolean;
  numero: number;
}

@Component({
  selector: 'app-rewards',
  imports: [CommonModule],
  templateUrl: './rewards.html',
  styleUrl: './rewards.css',
})
export class RewardsComponent implements OnInit {

  slots = Array.from({ length: 10 }, (_, i) => i + 1);

  state: RecompensaState = {
    idCliente: 1,
    cortesAcumulados: 4,
    meta: 10,
    cortesGratis: 0,
    faltantes: 6,
    recompensaDisponible: false,
  };

  historial: HistorialItem[] = [
    { numero: 4, tipo: 'Fade clásico',       fecha: '22 may 2025', gratis: false },
    { numero: 3, tipo: 'Degradado + barba',  fecha: '08 may 2025', gratis: false },
    { numero: 2, tipo: 'Corte clásico',      fecha: '20 abr 2025', gratis: false },
    { numero: 1, tipo: 'Fade + diseño',      fecha: '03 abr 2025', gratis: false },
  ];

  ngOnInit(): void {
    this.cargarRecompensa();
  }

  cargarRecompensa(): void {
    // TODO: reemplazar con tu servicio real
    // this.recompensaService.getByCliente(this.state.idCliente).subscribe(data => {
    //   this.state = {
    //     ...data,
    //     meta: 10,
    //     faltantes: 10 - (data.cortesAcumulados % 10),
    //     recompensaDisponible: data.cortesAcumulados % 10 === 0,
    //   };
    // });
    this.recalcular();
  }

  recalcular(): void {
    const acum = this.state.cortesAcumulados;
    this.state.faltantes     = this.state.meta - (acum % this.state.meta);
    this.state.cortesGratis  = Math.floor(acum / this.state.meta);
    this.state.recompensaDisponible = acum > 0 && acum % this.state.meta === 0;
  }

  canRedeem(): boolean {
    return this.state.recompensaDisponible;
  }

  progressPct(): number {
    const resto = this.state.cortesAcumulados % this.state.meta;
    return Math.min((resto / this.state.meta) * 100, 100);
  }

  getLevelLabel(): string {
    const total = this.state.cortesAcumulados;
    if (total >= 30) return 'Nivel Oro ✦';
    if (total >= 15) return 'Nivel Plata';
    return 'Miembro';
  }

  onCanjear(): void {
    if (!this.canRedeem()) return;
    // TODO: llamar servicio de canje
    console.log('Canjeando corte gratis...');
  }
}