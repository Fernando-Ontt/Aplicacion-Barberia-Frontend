import { ProductoList } from './pages/producto-lista/producto-list/producto-list';



export const PRODUCTOS_ROUTE = [
  { path: '',
    loadComponent: () => import('./pages/producto-lista/producto-list/producto-list').then(m => m.ProductoList),
  }
    
];