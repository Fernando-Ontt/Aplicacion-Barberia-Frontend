import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Token } from '../../services/token/token';

export const guestGuardGuard: CanActivateFn = (route, state) => {


  const tokenService = inject(Token);
  const router = inject(Router);
 if (tokenService.isLogged()) {
  return router.createUrlTree([tokenService.getHomeByRole()]);

}
  return true;
};
