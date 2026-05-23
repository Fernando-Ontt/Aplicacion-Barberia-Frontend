import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { NosotrosComponent } from './features/public/pages/nosotros/nosotros..component';
import { ServiciosComponent } from './features/public/pages/servicios/servicios.component';
import { ReservasComponent } from './features/public/pages/reservas/reservas.component';
import { ReclamosComponent } from './features/public/pages/reclamos/reclamos.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { PublicLayoutComponent } from './features/public/layout/public-layout.component';
import { DashboardClienteComponent } from './features/private/dashboard/dashboard-cliente/dashboard-cliente.component';
import { Error404Component } from './shared/components/error404/error404.component';
import { InicioComponent } from './features/public/pages/inicio/inicio.component';
import { CarritoComponent } from './features/public/pages/carrito/carrito.component';
import { BarberoLayoutComponent } from './features/private/layout/barbero-layout.component';
import { DashboardAdministrativoComponent } from './features/private/dashboard/dashboard-administrativo/dashboard-administrativo.component';
import { PerfilClient } from './features/private/components/gestion/clientes/perfil-client/perfil-client';
import { RegistrarClient } from './features/private/components/gestion/clientes/registrar-client/registrar-client';
import { RegistrarBarbero } from './features/private/components/gestion/barberos/registrar-barbero/registrar-barbero';
import { PerfilBarbero } from './features/private/components/gestion/barberos/perfil-barbero/perfil-barbero';

export const routes: Routes = [
  {path: 'dashboard/admin',component: DashboardAdministrativoComponent,
    canActivate: [authGuard],data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      { path: 'resumen', loadComponent: () => import('./features/private/components/resumen/resumen').then(m => m.Resumen) },
      {path: 'catalogo', children: [
        { path: 'categorias', loadComponent: () => import('./features/private/components/catalogo/categorias/categorias.component').then(m => m.CategoriasComponent) },
        { path: 'productos', loadComponent: () => import('./features/private/components/catalogo/productos/productos.component').then(m => m.ProductosComponent) },
        { path: 'productos/detalle/:id', loadComponent: () => import('./features/private/components/catalogo/productos/producto-detalle/producto-detalle.component').then(m => m.ProductoDetalleComponent) },
        { path: 'servicios', loadComponent: () => import('./features/private/components/catalogo/servicios/servicios.component').then(m => m.ServiciosComponent) },
      ]},
      {path: 'operaciones',children: [
        {path: 'ventas', loadComponent: () => import('./features/private/components/operaciones/ventas/ventas.component').then(m => m.VentasComponent)}
      ]},
      {path: 'gestion', children: [
        { path: 'clientes', loadComponent: () => import('./features/private/components/gestion/clientes/clientes').then(m => m.Clientes) },
        { path: 'clientes/register-cliente', component: RegistrarClient },
        { path: 'clientes/:id', component: PerfilClient },
        { path: 'barberos', loadComponent: () => import('./features/private/components/gestion/barberos/barberos').then(m => m.Barberos) },
          { path: 'barberos/registrar-barbero', component:RegistrarBarbero},
          { path: 'barberos/:id', component: PerfilBarbero },
      ]},
      { path: '**', loadComponent: () => import('./shared/components/error404/error404.component').then(m => m.Error404Component) }
    ]
  },

  {path: 'dashboard/barbero', component: BarberoLayoutComponent,
    canActivate: [authGuard],data: { roles: ['barbero'] },
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      { path: 'resumen', loadComponent: () => import('./features/private/components/resumen/resumen-barbero').then(m => m.ResumenBarbero) },
      { path: 'reservas', loadComponent: () => import('./features/private/components/reserva/reserva').then(m => m.ReservaComponent) },
      {path: 'operaciones',children: [
        {path: 'ventas', loadComponent: () => import('./features/private/components/operaciones/ventas/ventas.component').then(m => m.VentasComponent)}
      ]},
      {path: 'gestion', children: [
        { path: 'clientes', loadComponent: () => import('./features/private/components/gestion/clientes/clientes').then(m => m.Clientes) },
        { path: 'clientes/registrar-client', component: RegistrarClient },
          { path: 'clientes/register-cliente', component: RegistrarClient },
        { path: 'clientes/:id', component: PerfilClient },
        { path: 'barberos', loadComponent: () => import('./features/private/components/gestion/barberos/barberos').then(m => m.Barberos) },
      ]},
      { path: '**', loadComponent: () => import('./shared/components/error404/error404.component').then(m => m.Error404Component) }
    ]
  },
  
  {path: '', component: PublicLayoutComponent, children: [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
    { path: 'nosotros', component: NosotrosComponent },
    //esta raro esta wea 
    { path: 'productos', loadComponent: () => import('./features/public/pages/productos/productos.component').then(m => m.ProductComponent) },
    { path: 'productos/detalle/:id', loadComponent: () => import('./features/public/pages/productos/producto-detalle/producto-detalle.component').then(m => m.ProductoDetalleComponent) },
    { path: 'servicios', component: ServiciosComponent },
    { path: 'reclamos', component: ReclamosComponent },
    { path: 'reservas', component: ReservasComponent },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'carrito', component: CarritoComponent },
    {path: 'mi-cuenta',component: DashboardClienteComponent,
      canActivate: [authGuard],data: { roles: ['cliente'] },
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', loadComponent: () => import('./features/private/pages/resumen/resumen.component').then(m => m.ResumenComponent) },
        { path: 'reservar', loadComponent: () => import('./features/private/pages/reservar/reservar.component').then(m => m.ReservarComponent) },
        { path: 'historial', loadComponent: () => import('./features/private/pages/historial/historial.component').then(m => m.ClienteHistorialComponent) },
        { path: 'rewards', loadComponent: () => import('./features/private/pages/rewards/rewards.component').then(m => m.RewardsComponent) },
        { path: 'perfil', loadComponent: () => import('./features/private/pages/perfil/perfil.component').then(m => m.PerfilComponent) },
        { path: '**', loadComponent: () => import('./shared/components/error404/error404.component').then(m => m.Error404Component) }
      ]},
      { path: '**', component: Error404Component }
    ]
  }, 
  
  {path: 'login',canActivate: [guestGuard], loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)},

  { path: '**', component: Error404Component },

];