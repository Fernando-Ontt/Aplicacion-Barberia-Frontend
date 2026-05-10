import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/auth/token.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  const token = tokenService.getAccessToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) return throwError(() => error);

        return authService.refreshToken().pipe(
          switchMap(response => {tokenService.saveAccessToken(response.data.accessToken);
            const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${response.data.accessToken}` }});
            return next(retryReq);
          })
        );
      }
      return throwError(() => error);
    })
  );
};