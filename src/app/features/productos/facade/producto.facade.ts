import { effect, inject, Injectable, signal } from "@angular/core";
import { ProductoService } from "../services/producto-service";
import { ProductoStore } from "../store/producto.store";
import { tap } from "rxjs";

@Injectable({ providedIn: 'root' })

export class ProductoFacade {

     private api = inject(ProductoService);
  private store = inject(ProductoStore);

  
  private refresh = signal(0);

  productos = this.store.productos;

  constructor() {
    
    effect(() => {
      this.refresh();

      this.api.getProductos().subscribe(res => {
        this.store.setProductos(res.data.content);
      });
    });
  }

  cargarProductos() {
    this.refresh.update(v => v + 1);
  }

  agregarProducto(producto: any) {
    this.store.agregarProducto(producto);
  }

   
}
