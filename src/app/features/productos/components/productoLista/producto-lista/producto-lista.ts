import { Component, Input } from '@angular/core';
import { ProductoCard } from '../../producto-card/producto-card/producto-card';
import { ProductoResponse } from '../../../models/response/ProductoResponse';

@Component({
  selector: 'app-producto-lista',
  imports: [ProductoCard],
  templateUrl: './producto-lista.html',
  styleUrl: './producto-lista.css',
})
export class ProductoLista {
  @Input() productos: ProductoResponse[] = [];

}
