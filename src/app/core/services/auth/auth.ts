import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Token } from '../token/token';
import { LoginRequest } from '../../../features/auth/models/LoginRequest';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../../features/auth/models/LoginResponse';
import { RefreshRequest } from '../../../features/auth/models/RefreshRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private API = environment.apiUrl + '/auth';

  private http = inject(HttpClient);
  private tokenService = inject(Token);

   login(data: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.API + "/login", data)
      .pipe(
        tap(res => {

          this.tokenService.saveAccessToken(res.data.accessToken);
          this.tokenService.saveRefreshToken(res.data.refreshToken);

        })
      );
  }

  refreshToken(): Observable<LoginResponse>{

    const token = this.tokenService.getRefreshToken();

    const body: RefreshRequest = { refreshToken: token! };

    return this.http.post<LoginResponse>(this.API + "/refresh", body);
  }

  logout(){
    this.tokenService.clearTokens();
  }


  
}
