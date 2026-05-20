import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/shared/components/sidebar/sidebar.component';

@Component({
    selector: 'app-barbero-layout',
  standalone: true,
    imports: [SidebarComponent, RouterOutlet],
    template: `
  <div class="relative min-h-screen overflow-hidden bg-brand-black">
    @if (sidebarOpen) {
      <div class="fixed inset-0 z-30 bg-black/60 md:hidden" (click)="toggleSidebar()"></div>
    }

    <div class="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-ui-border bg-ui-black px-4 md:px-6">
      <div class="flex items-center gap-4">
        <button type="button" class="rounded-md bg-transparent p-2 text-brand-gold md:hidden"
          (click)="toggleSidebar()"
          aria-label="Abrir o cerrar menú">
          <i class="pi pi-bars"></i>
        </button>
        <button type="button" class="hidden rounded-md border border-ui-border bg-transparent p-2 text-brand-gold md:inline-flex"
          (click)="toggleSidebarCollapsed()"
          [attr.aria-label]="sidebarCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'">
          <i class="pi" [class.pi-angle-double-right]="sidebarCollapsed" [class.pi-angle-double-left]="!sidebarCollapsed"></i>
        </button>
        <h2 class="text-lg font-semibold text-white">Panel Barbero</h2>
      </div>
      <div class="flex items-center gap-4">
        <span class="hidden text-text-muted sm:inline">Estado:</span>
        <span class="rounded-md bg-green-600 px-3 py-1 text-sm text-white">Disponible</span>
      </div>
    </div>

    <div class="flex pt-16">
      <aside class="fixed inset-y-16 left-0 z-40 w-72.5 shrink-0 border-r border-ui-border bg-brand-black transition-transform duration-300 md:hidden"
        [class.-translate-x-full]="!sidebarOpen"
        [class.translate-x-0]="sidebarOpen">
        <app-sidebar class="block h-full" [collapsed]="false" />
      </aside>

      <aside class="hidden h-[calc(100vh-4rem)] overflow-hidden border-r border-ui-border transition-all duration-300 md:block"
        [class.w-72.5]="!sidebarCollapsed"
        [class.w-20]="sidebarCollapsed">
        <app-sidebar class="block h-full" [(collapsed)]="sidebarCollapsed" />
      </aside>

      <div class="min-h-[calc(100vh-4rem)] min-w-0 flex-1 overflow-y-auto bg-brand-black p-4 md:p-6">
        <router-outlet></router-outlet>
      </div>
    </div>
  </div>
  `,
})
export class BarberoLayoutComponent {
  sidebarOpen = false;
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSidebarCollapsed() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
