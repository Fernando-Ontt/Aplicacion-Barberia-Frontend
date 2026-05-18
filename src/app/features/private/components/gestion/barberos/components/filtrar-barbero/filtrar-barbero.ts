import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-filtrar-barbero',
  imports: [ButtonModule],
  templateUrl: './filtrar-barbero.html',
  styleUrl: './filtrar-barbero.css',
})
export class FiltrarBarbero {
  @Output() apply = new EventEmitter<{ status: string; order: string }>();
  @Output() clear = new EventEmitter<void>();

  onApply(status: string, order: string) { this.apply.emit({ status, order }); }
  onClear() { this.clear.emit(); }

}
