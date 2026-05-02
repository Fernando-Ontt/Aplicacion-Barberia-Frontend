import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Token } from '../../services/token/token';

export const rolGuardsGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(Token);

  const router = inject(Router);


  const rolesUsuario = tokenService.getRoles();
  const rolesPermitidos = route.data['roles'] ;


  const authorized = rolesUsuario.some(r =>
     rolesPermitidos.includes(r));

     if (authorized){
      return true;
     } 
    if(rolesUsuario.includes('ROLE_cliente')){
      router.navigate(['/app']);
    } else{
      router.navigate(['/dashboard']);
    }


  return false;
};
