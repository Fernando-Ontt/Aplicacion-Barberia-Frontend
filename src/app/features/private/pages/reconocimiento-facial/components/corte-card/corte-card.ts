import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IaService } from '@core/services/reconocimiento-facial/reconocimiento-facial.service';
import { CorteRecomendado } from '@core/models/reconocimiento-facial/Ia.model';

@Component({
  selector: 'app-corte-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './corte-card.html',
  styleUrl: './corte-card.css'
})
export class CorteCard {

  @Input()
  fotoPreview = '';

  @Input()
  corte!: CorteRecomendado;

  @Input()
  clienteId = 1;

  @Output()
  ver = new EventEmitter<CorteRecomendado>();

  rating = 0;

  liked?: boolean;

  constructor(
    private iaService: IaService
  ) { }

  abrirModal() {
    console.log('emitiendo corte', this.corte);
    this.ver.emit(this.corte);
  }

  like() {

    this.liked = true;

    this.iaService
      .enviarFeedback(
        this.clienteId,
        this.corte.id,
        true,
        5
      )
      .subscribe();

  }

  modalIaAbierto = false;



  dislike() {

    this.liked = false;

    this.iaService
      .enviarFeedback(
        this.clienteId,
        this.corte.id,
        false,
        1
      )
      .subscribe();

  }

  calificar(valor: number) {

    this.rating = valor;

    this.iaService
      .enviarFeedback(
        this.clienteId,
        this.corte.id,
        valor >= 3,
        valor
      )
      .subscribe();

  }

  cargandoIA = false;
  imagenIA = '';

  probarConIA(): void {
    this.modalIaAbierto = true;
    this.cargandoIA = true;
    this.imagenIA = '';

    fetch(this.fotoPreview)
      .then(r => r.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append('foto', blob, 'foto.jpg');
        formData.append('nombre_corte', this.corte.nombre);

        return fetch('http://localhost:8000/ia/preview-corte', {
          method: 'POST',
          body: formData
        });
      })
      .then(r => r.json())
      .then(data => {
        if (data.imagen_b64) {
          this.imagenIA = 'data:image/png;base64,' + data.imagen_b64;
        }
        this.cargandoIA = false;
      })
      .catch(() => {
        this.cargandoIA = false;
      });
  }

}