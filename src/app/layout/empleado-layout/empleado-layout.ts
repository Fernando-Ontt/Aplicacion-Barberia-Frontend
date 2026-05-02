import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Token } from '../../core/services/token/token';

@Component({
  selector: 'app-empleado-layout',
  standalone: true,
  imports: [RouterOutlet,Footer,Header,Sidebar],
  templateUrl: './empleado-layout.html',
  styleUrl: './empleado-layout.css',
})
export class EmpleadoLayout {

  

}
