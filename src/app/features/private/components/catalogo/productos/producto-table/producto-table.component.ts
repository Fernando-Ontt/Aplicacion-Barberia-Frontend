import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { TableLazyLoadEvent } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ConfirmPopoverComponent } from '@/app/shared/components/confirm-popover/confirm-popover.component';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { Producto } from '@/app/core/models/catalogos/productos.model';
import { environment } from '@/environments/environment.development';

@Component({
  selector: 'app-producto-table',
  imports: [ButtonModule, CommonModule, TableModule, ConfirmPopoverComponent, DialogModule, ToggleSwitchModule,
    ImageModule, IconFieldModule, InputIconModule, StatusBadgeComponent, GalleriaModule, FormsModule
  ],
  templateUrl: './producto-table.html',
  styleUrl: './producto-table.css',
})
export class ProductoTableComponent {
  @Output() lazyLoad = new EventEmitter<TableLazyLoadEvent>();
  @Output() ver = new EventEmitter<number>();
  @Output() editar = new EventEmitter<Producto>();
  @Output() eliminar = new EventEmitter<Producto>();
  @Output() estado = new EventEmitter<{ id: number, activo: boolean }>();
  @Output() publicado = new EventEmitter<{ id: number, publicado: boolean }>();
  @Input({ required: true }) productos: Producto[] = [];
  @Input() icono: string = 'pi-trash';
  @Input() cargado = false;
  @Input() totalRecords = 0;
  @Input() rows = 25;


  mostrarConfirmacion = false;
  productoAEliminar: Producto | null = null;
  environment = environment.apiBaseUrl;

  numVisible = 5;
  activeIndex = 0;
  mostrarGaleria = false;
  imagenesGaleria: any[] = [];

  verProducto(producto: Producto) {
    this.ver.emit(producto.id);
  }

  actualizarProducto(producto: Producto) {
    this.editar.emit(producto);
  }

  cambiarEstadoProducto(producto: Producto, event: { checked: boolean }) {
    this.estado.emit({ id: producto.id, activo: event.checked })
  }

  cambiarPublicadoProducto(producto: Producto, event: { checked: boolean }) {
    this.publicado.emit({ id: producto.id, publicado: event.checked })
  }

  pedirConfirmacion(producto: Producto, event: MouseEvent) {
    event.stopPropagation();
    this.productoAEliminar = producto;
    this.mostrarConfirmacion = true;
  }

  eliminarDesdeTree(producto: Producto) {
    this.productoAEliminar = producto;
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar() {
    if (!this.productoAEliminar) return;
    this.eliminar.emit(this.productoAEliminar);
    this.cancelarEliminar();
  }

  cancelarEliminar() {
    this.mostrarConfirmacion = false;
    this.productoAEliminar = null;
  }

  get mensajeConfirmacion(): string {
    return this.productoAEliminar ? `¿Seguro que deseas eliminar el producto "${this.productoAEliminar.nombre}"?` : '';
  }

  abrirGaleria(producto: Producto, index: number = 0) {
    if (!producto.urlsMultimedia?.length) return;

    this.imagenesGaleria = producto.urlsMultimedia.map((url, i) => ({
      itemImageSrc: this.environment + url,
      thumbnailImageSrc: this.environment + url,
      alt: producto.nombre + ' ' + i
    }));

    this.activeIndex = Math.min(index, this.imagenesGaleria.length - 1);
    this.numVisible = Math.min(this.imagenesGaleria.length, 5);
    this.mostrarGaleria = true;
  }

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 }
  ];

  agruparCaracteristicas(caracteristicas: { nombre: string, valor: string }[] = []): { nombre: string, valores: string[] }[] {
    const agrupadas: Record<string, string[]> = {};
    caracteristicas.forEach(c => {
      if (!agrupadas[c.nombre]) { agrupadas[c.nombre] = []; }
      agrupadas[c.nombre].push(c.valor);
    });
    return Object.entries(agrupadas).map(([nombre, valores]) => ({ nombre, valores }));
  }
}