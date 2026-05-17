import { Component } from '@angular/core';
import { HeaderBarbero } from "./components/header-barbero/header-barbero";
import { ResumenGeneralBarbero } from './components/resumen-general-barbero/resumen-general-barbero';
import { TableBarbero } from './components/table-barbero/table-barbero';
import { TableVentasComisiones } from './components/table-ventas-comisiones/table-ventas-comisiones';
import { TableCortesBarberoMes } from './components/table-cortes-barbero-mes/table-cortes-barbero-mes';
import { RankingRendimiento } from './components/ranking-rendimiento/ranking-rendimiento';

@Component({
  selector: 'app-barberos',
  imports: [HeaderBarbero, ResumenGeneralBarbero, TableBarbero, TableVentasComisiones, TableCortesBarberoMes, RankingRendimiento],
  templateUrl: './barberos.html',
  styleUrl: './barberos.css',
})
export class Barberos {
icono: string = 'pi-users';

  searchTerm: string = '';

  abrirCrear(): void {
    // TODO: conectar con el formulario/diálogo de creación de barbero
    return;
  }

  onSearch(query: string): void {
    this.searchTerm = query;
    // Puedes usar searchTerm para filtrar la lista de barberos
  }

}
