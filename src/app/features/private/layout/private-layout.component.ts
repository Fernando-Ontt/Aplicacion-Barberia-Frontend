import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/shared/components/sidebar/sidebar.component';

@Component({
    selector: 'app-empleado-layout',
    imports: [SidebarComponent, RouterOutlet],
    template: `
    <div class="flex h-screen overflow-hidden">
        <app-sidebar class="w-[290px] shrink-0 h-screen border-r border-ui-border bg-brand-black"/>
        <div class="flex-1 h-screen overflow-y-auto p-4 bg-brand-black">
            <router-outlet></router-outlet>
        </div>
    </div>`,
})
export class PrivateLayoutComponent {

}
