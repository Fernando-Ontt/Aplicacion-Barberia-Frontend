import { Routes } from '@angular/router';
import { Inicio } from './features/public/pages/inicio/inicio';
import { Nosotros } from './features/public/pages/nosotros/nosotros';
import { Productos } from './features/public/pages/productos/productos';
import { Servicios } from './features/public/pages/servicios/servicios';
import { Reservas } from './features/public/pages/reservas/reservas';
import { Reclamos } from './features/public/pages/reclamos/reclamos';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Error404 } from './features/public/pages/error404/error404';
import { EmpleadoLayout } from './layout/empleado-layout/empleado-layout';
import { PublicLayout } from './layout/public-layout/public-layout';
import { authGuardGuard } from './core/guards/auth/auth-guard-guard';
import { guestGuardGuard } from './core/guards/guess/guest-guard-guard';



export const routes: Routes = [

 {
  path: '',
  component: PublicLayout,
  children: [
    { path: '', component: Inicio,  canActivate: [guestGuardGuard], },

    { path: 'inicio', component: Inicio },
    { path: 'nosotros', component: Nosotros },
    { path: 'productos', component: Productos },
    { path: 'servicios', component: Servicios },
    { path: 'reclamos', component: Reclamos },
    { path: 'reservas', component: Reservas },
    
    { path: 'register', component: Register },
  ]
},

 {
  path: 'dashboard',
  component: EmpleadoLayout,
  canActivate: [authGuardGuard],
  children: [
    
  ]
},
  {
    path: 'login',
    canActivate: [guestGuardGuard],
    loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login)
  },  

  { path: '**', component: Error404 },
  
];