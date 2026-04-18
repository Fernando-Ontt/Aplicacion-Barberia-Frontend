import { Routes } from '@angular/router';
import { Inicio } from './public/inicio/inicio';
import { Nosotros } from './public/nosotros/nosotros';
import { Productos } from './public/productos/productos';
import { Servicios } from './public/servicios/servicios';
import { Reclamos } from './public/reclamos/reclamos';
import { Login } from './public/login/login';
import { Register } from './public/register/register';
import { Error404 } from './public/error404/error404';
import { Reservas } from './public/reservas/reservas';



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