import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-perfil-barbero',
  imports: [],
  templateUrl: './header-perfil-barbero.html',
  styleUrl: './header-perfil-barbero.css',
})
export class HeaderPerfilBarbero implements OnInit {

  barberoNombre = 'Luis Ríos Paredes';
  barberoIniciales = 'LR';
  barberoDescripcion = 'Barbero júnior con buen manejo de técnicas modernas';
  
  cortesMesActual = 38;
  ingresosGenerados = 'S/1,900';
  comisionGanada = 'S/342';
  reservasHoy = 6;
  
  nombre = 'Luis';
  apellido = 'Ríos Paredes';
  telefono = '+51 912 345 678';
  email = 'luis@boria.pe';
  fechaIngreso = '10 ene 2022';
  experiencia = '3 años';
  sueldo = 'S/1,200';
  comision = '48%';
  descripcion = 'Barbero júnior con buen manejo de técnicas modernas de degradado y fade. En etapa de crecimiento. Requiere acompañamiento en puntualidad y productividad.';
  usuario = '';
  contrasena = '';
  idUsuario = 0;

  ngOnInit(): void {
    // Cargar datos del barbero desde el servicio
    this.actualizarVista();
  }


  private actualizarVista(): void {
    this.barberoNombre = this.nombre && this.apellido ? `${this.nombre} ${this.apellido}` : this.nombre || 'Barbero';
    this.barberoIniciales = this.getInitials(this.barberoNombre);
  }

  private getInitials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return 'BR';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  volver(): void {
    window.history.back();
  }

}
