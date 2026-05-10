import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MENU_CONFIG } from '../../config/menu.config';

@Injectable({
    providedIn: 'root',
})
export class SidebarItemsService {
    getSidebarItems(permisos: string[]): MenuItem[] {
        return this.filterItems(MENU_CONFIG, permisos);
    }

    private filterItems(items: any[], permisos: string[]): MenuItem[] {
        return items.map((item) => {
            const childItems = item.items ? this.filterItems(item.items, permisos) : undefined;
            const canShow = !item.permission || permisos.includes(item.permission) || !!childItems?.length;
            if (!canShow) {
                return null;
            }
            const menuItem: MenuItem = { label: item.label, icon: item.icon, routerLink: item.routerLink, };
            if (childItems?.length) {
                menuItem.items = childItems;
            }
            return menuItem;
        }).filter((item): item is MenuItem => item !== null);
    }
}