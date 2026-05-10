import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { NosotrosComponent } from './features/public/pages/nosotros/nosotros..component';
import { ServiciosComponent } from './features/public/pages/servicios/servicios.component';
import { ReservasComponent } from './features/public/pages/reservas/reservas.component';
import { ReclamosComponent } from './features/public/pages/reclamos/reclamos.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { PrivateLayoutComponent } from './features/private/layout/private-layout.component';
import { PublicLayoutComponent } from './features/public/layout/public-layout.component';
import { Error404Component } from './shared/components/error404/error404.component';
import { InicioComponent } from './features/public/pages/inicio/inicio.component';

export const routes: Routes = [

  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {path: 'inicio',redirectTo: '',pathMatch: 'full'},
      { path: '', component: InicioComponent, canActivate: [guestGuard], },

      { path: 'nosotros', component: NosotrosComponent },
      //esta raro esta wea 
      {path: 'productos',loadChildren: () =>import('./features/productos/productos.route').then(m => m.PRODUCTOS_ROUTE)},
      { path: 'servicios', component: ServiciosComponent },
      { path: 'reclamos', component: ReclamosComponent },
      { path: 'reservas', component: ReservasComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },

  {
    path: 'dashboard',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['admin', 'barbero'] },
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      {
        path: 'resumen',
        loadComponent: () => import('./features/private/components/resumen/resumen').then(m => m.Resumen)
      },
      {
        path: '',
        loadChildren: () => import('../app/features/productos/admin/producto.Admin.route').then(m => m.PRODUCTOS_ROUTE_ADMIN)
      },
      {
        path: '**',
        loadComponent: () => import('./shared/components/error404/error404.component').then(m => m.Error404Component)
      }
    ]

  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  { path: '**', component: Error404Component },

];