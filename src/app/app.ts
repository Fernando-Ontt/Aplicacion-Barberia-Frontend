import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Token } from './core/services/token/token';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Aplicacion-Barberia-Frontend');

  private tokenService = inject(Token);

  ngOnInit() {
   
    this.tokenService.initPermisos();
  }
}