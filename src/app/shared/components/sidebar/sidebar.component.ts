import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../core/services/auth/token.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarItemsService } from '@/app/core/services/layout/sidebar-items.service';
import { NotificationService } from '@/app/core/services/common/notification.service';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, PanelMenuModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  private notify = inject(NotificationService);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private sidebarItemsService = inject(SidebarItemsService);

  constructor() {
    this.tokenService.initPermisos();
  }

  menu$ = this.tokenService.permisos$.pipe(
    map((permisos) => {
      const role = this.tokenService.getPrimaryRole();
      return this.sidebarItemsService.getSidebarItems(permisos, role);
    })
  );

  logout() {
    this.tokenService.clearTokens();
    this.notify.showSuccess('Has cerrado sesión exitosamente');
    this.router.navigate(['/'], { replaceUrl: true });
  }

  toggleCollapsed() {
    this.collapsedChange.emit(!this.collapsed);
  }
}
