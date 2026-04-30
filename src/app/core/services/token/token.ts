import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class Token {

  private ACCESS_TOKEN = 'access_token';
  private REFRESH_TOKEN = 'refresh_token';

  saveAccessToken(token: string) {
    localStorage.setItem(this.ACCESS_TOKEN, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  saveRefreshToken(token: string) {
    localStorage.setItem(this.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  isLogged(): boolean {
    return !!this.getAccessToken();
  }

  private getDecodedToken(): any | null {
    try {
      const token = this.getAccessToken();

      if (!token || token.split('.').length !== 3) {
        return null;
      }

      return jwtDecode(token);

    } catch {
      return null;
    }
  }

  getRoles(): string[] {
    return this.getDecodedToken()?.roles || [];
  }

  getPermisos(): string[] {
    return this.getDecodedToken()?.permisos || [];
  }


}
