import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Token } from '../services/token/token';
import { AuthService } from '../services/auth/auth';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(Token);
  const authService = inject(AuthService);

  const token = tokenService.getAccessToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) return throwError(() => error);

        return authService.refreshToken().pipe(
          switchMap(response => {
            tokenService.saveAccessToken(response.data.accessToken);
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${response.data.accessToken}` }
            });
            return next(retryReq);
          })
        );
      }
      return throwError(() => error);
    })
  );
};