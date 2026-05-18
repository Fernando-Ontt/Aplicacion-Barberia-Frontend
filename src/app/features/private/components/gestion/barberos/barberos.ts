import { Component } from '@angular/core';
import { HeaderBarbero } from "./components/header-barbero/header-barbero";
import { ResumenGeneralBarbero } from './components/resumen-general-barbero/resumen-general-barbero';
import { TableBarbero } from './components/table-barbero/table-barbero';
import { FiltrarBarbero } from "./components/filtrar-barbero/filtrar-barbero";


@Component({
  selector: 'app-barberos',
  imports: [HeaderBarbero, ResumenGeneralBarbero, TableBarbero, FiltrarBarbero],
  templateUrl: './barberos.html',
  styleUrl: './barberos.css',
})
export class Barberos {
icono: string = 'pi-users';

  searchTerm: string = '';

  barberos: any[] = [
    {
      barberoId: 1,
      persona: { nombre: 'Marco', apellido: 'Vega', email: 'marco@beria.pe' },
      experiencia: '6 años',
      estado: 'Disponible',
      reservas: 7,
      comision: '22%',
      sueldo: 'S/1,600',
      ventasHoy: 'S/290'
    },
    {
      barberoId: 2,
      persona: { nombre: 'Luis', apellido: 'Ríos', email: 'luis@beria.pe' },
      experiencia: '3 años',
      estado: 'En descanso',
      reservas: 6,
      comision: '18%',
      sueldo: 'S/1,200',
      ventasHoy: 'S/310'
    }
  ];

  totalElements: number = this.barberos.length;
  currentPage: number = 0;
  totalPages: number = 1;

  abrirCrear(): void {
    // TODO: conectar con el formulario/diálogo de creación de barbero
    return;
  }

  onSearch(query: string): void {
    this.searchTerm = query;
    // Puedes usar searchTerm para filtrar la lista de barberos
  }

  onPrev(): void {
    if (this.currentPage > 0) this.currentPage -= 1;
  }

  onNext(): void {
    if (this.currentPage < this.totalPages - 1) this.currentPage += 1;
  }

}
