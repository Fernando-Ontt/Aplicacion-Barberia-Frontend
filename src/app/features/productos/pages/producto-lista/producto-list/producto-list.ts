import { Component, inject, Input, OnInit } from '@angular/core';
import { ProductoResponse } from '../../../models/response/ProductoResponse';
import { ProductoCard } from '../../../components/producto-card/producto-card/producto-card';
import { map, Observable } from 'rxjs';
import { ProductoService } from '../../../services/producto-service';
import { ProductoLista } from "../../../components/productoLista/producto-lista/producto-lista";
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-producto-list',
  imports: [ProductoCard, ProductoLista,AsyncPipe],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css',
})
export class ProductoList implements OnInit{
  


  productos$!: Observable<ProductoResponse[]>;
  private productoService = inject(ProductoService);
  

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productos$ = this.productoService.getProductos().pipe(
      map(response => response.data.content) 
    );
  }

  

}
