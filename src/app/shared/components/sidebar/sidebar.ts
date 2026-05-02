import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Token } from '../../../core/services/token/token';
import { MENU_CONFIG } from '../../../core/config/menu.config';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {




private router = inject(Router);
  private tokenService = inject(Token);



  menu$ = this.tokenService.permisos$.pipe(
    map(permisos =>
      MENU_CONFIG.filter(item =>
        !item.permission || permisos.includes(item.permission)
      )
    )

  );

  collapsed=false;

  toggle(){
    this.collapsed = !this.collapsed;
  }
  
  

  logout() {
  this.tokenService.clearTokens();
  this.router.navigate(['/'], { replaceUrl: true });
}



}
