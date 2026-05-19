import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '@/app/shared/components/sidebar/sidebar.component';
import { TokenService } from '../../../../core/services/auth/token.service';
import { SidebarItemsService } from '../../../../core/services/layout/sidebar-items.service';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CLIENTE_MENU } from '../../../../core/config/menu.cliente.confing';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [SidebarComponent, CommonModule, PanelMenuModule],
  templateUrl: './dashboard-cliente.html',
  styleUrl: './dashboard-cliente.css',
})
export class DashboardClienteComponent implements OnInit, OnDestroy {
  private tokenService = inject(TokenService);
  private sidebarItemsService = inject(SidebarItemsService);

  sidebarVisible = false;
  sidebarCollapsed = false;
  activeSection = 'dashboard';
  userFullName = '';
  clienteMenuItems: MenuItem[] = [];
  private permisosSub?: Subscription;

  ngOnInit() {
    this.userFullName = this.tokenService.getUserDisplayName();
    this.tokenService.initPermisos();
    this.loadMenuItems();
  }

  ngOnDestroy() {
    this.permisosSub?.unsubscribe();
  }

  private loadMenuItems() {
    this.permisosSub = this.tokenService.permisos$.subscribe((permisos) => {
      const menuItems = this.getMenuItemsFromConfig(CLIENTE_MENU, permisos);
      this.clienteMenuItems = this.transformMenuItems(menuItems);
    });
  }

  private getMenuItemsFromConfig(items: any[], permisos: string[]): any[] {
    return items.map((item) => {
      const childItems = item.items ? this.getMenuItemsFromConfig(item.items, permisos) : undefined;
      const canShow = permisos.length === 0 || !item.permission || permisos.includes(item.permission) || !!childItems?.length;
      if (!canShow) {
        return null;
      }
      return {
        ...item,
        items: childItems,
      };
    }).filter((item): item is any => item !== null);
  }

  private transformMenuItems(items: any[]): MenuItem[] {
    return items.map((item) => {
      const menuItem: MenuItem = {
        label: item.label,
        icon: item.icon,
        command: () => this.handleMenuItemClick(item.routerLink),
      };

      if (item.items && item.items.length > 0) {
        menuItem.items = this.transformMenuItems(item.items);
      }

      return menuItem;
    });
  }

  private handleMenuItemClick(routerLink: string[] | undefined) {
    if (routerLink && routerLink[0]) {
      const section = routerLink[0].split('/').pop();
      if (section) {
        this.setActiveSection(section);
      }
    }
  }

  toggleSidebar() {
    if (window.innerWidth >= 768) {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    } else {
      this.sidebarVisible = !this.sidebarVisible;
    }
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    // Cerrar sidebar en móvil después de hacer clic
    if (window.innerWidth < 768) {
      this.sidebarVisible = false;
    }
  }

  get isDashboard() { return this.activeSection === 'dashboard'; }
  get isReservar() { return this.activeSection === 'reservar'; }
  get isMisReservas() { return this.activeSection === 'reservas'; }
  get isHistorial() { return this.activeSection === 'historial'; }
  get isRewards() { return this.activeSection === 'rewards'; }
  get isPerfil() { return this.activeSection === 'perfil'; }
}
