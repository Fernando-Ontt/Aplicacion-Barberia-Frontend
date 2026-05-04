import { inject, Injectable, signal } from "@angular/core";
import { ProductoResponse } from "../models/response/ProductoResponse";
import { BehaviorSubject } from "rxjs";
import { ProductoService } from "../services/producto-service";

@Injectable({providedIn: 'root'})
export class ProductoStore {


  productos = signal<ProductoResponse[]>([]);

  setProductos(data: ProductoResponse[]) {
    this.productos.set(data);
  }

  getProductos() {
    return this.productos();
  }

  agregarProducto(producto: ProductoResponse) {
    this.productos.update(list => [producto, ...list]);
  }

  limpiar() {
    this.productos.set([]);
  }
}    