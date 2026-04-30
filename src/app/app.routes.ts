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



export const routes: Routes = [

 {
  path: '',
  component: PublicLayout,
  children: [
    { path: '', component: Inicio },
    { path: 'inicio', component: Inicio },
    { path: 'nosotros', component: Nosotros },
    { path: 'productos', component: Productos },
    { path: 'servicios', component: Servicios },
    { path: 'reclamos', component: Reclamos },
    { path: 'reservas', component: Reservas },
    
    { path: 'register', component: Register },
  ]
},

  // 🔥 EMPLEADO LAYOUT (AQUÍ ESTABA EL ERROR)
  {
    path: 'empleado',
    component: EmpleadoLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login)
  },  

  { path: '**', component: Error404 }
];