import { CanActivateFn, Router } from '@angular/router';
import { Token } from '../../services/token/token';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = ( state) => {
  const tokenService = inject(Token);
  const router = inject(Router);


  if( tokenService.isLogged()){
    return true;
  } 
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
