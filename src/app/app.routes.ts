import { Routes } from '@angular/router';
import { Inicio } from './features/public/pages/inicio/inicio';
import { Nosotros } from './features/public/pages/nosotros/nosotros';
import { Productos } from './features/public/pages/productos/productos';
import { Servicios } from './features/public/pages/servicios/servicios';
import { Reservas } from './features/public/pages/reservas/reservas';
import { Reclamos } from './features/public/pages/reclamos/reclamos';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Error404 } from './features/public/pages/error404/error404';



export const routes: Routes = [
    {path:'',component:Inicio,title:'Inicio'},
    {path:'inicio',component:Inicio,title:'Inicio'},
    {path:'nosotros',component:Nosotros,title:'Nosotros'},
    {path:'productos',component:Productos,title:'Productos'},
    {path:'servicios',component:Servicios,title:'Servicios'},
    {path:'reclamos',component:Reclamos,title:'Reclamos'},
    {path:'reservas',component:Reservas,title:'Reservas'},
    {path:'login',component:Login,title:'Login'},
    {path:'register',component:Register,title:'Register'},
    {path:'**',component:Error404,title:'Error'}
];