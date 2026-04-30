import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-empleado-layout',
  standalone: true,
  imports: [RouterOutlet,Footer,Header],
  templateUrl: './empleado-layout.html',
  styleUrl: './empleado-layout.css',
})
export class EmpleadoLayout {

}
