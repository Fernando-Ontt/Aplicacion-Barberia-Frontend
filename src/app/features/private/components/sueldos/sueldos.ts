import { Component } from '@angular/core';
import { ResumenPeriodoComponent } from "./components/resumen-periodo/resumen-periodo";
import { GraficoSueldos } from "./components/grafico-sueldos/grafico-sueldos";
import { TablaSueldos } from "./components/tabla-sueldos/tabla-sueldos";

@Component({
  selector: 'app-sueldos',
  imports: [ResumenPeriodoComponent, GraficoSueldos, TablaSueldos],
  templateUrl: './sueldos.html',
  styleUrl: './sueldos.css',
})
export class Sueldos {

}
