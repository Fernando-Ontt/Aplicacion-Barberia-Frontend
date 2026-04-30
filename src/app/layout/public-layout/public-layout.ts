import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet,Footer,Header],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {

}
