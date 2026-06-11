import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ILoginResponse, IRefreshResponse, IUserProfile } from '../interfaces/login';

@Injectable({
  providedIn: 'root',
})
export class Login {
  private readonly httpClient = inject(HttpClient);
  private readonly loginUrl = 'https://dummyjson.com/auth/login';
  private readonly refreshUrl = 'https://dummyjson.com/auth/refresh';
  private readonly meUrl = 'https://dummyjson.com/auth/me';

  async login(username: string, password: string, expiresInMins?: number) {
    return firstValueFrom(
      this.httpClient.post<ILoginResponse>(
        this.loginUrl,
        { username, password, expiresInMins },
        { withCredentials: true },
      ),
    );
  }

  async refresh(refreshToken: string, expiresInMins?: number) {
    return firstValueFrom(
      this.httpClient.post<IRefreshResponse>(
        this.refreshUrl,
        { refreshToken, expiresInMins },
        { withCredentials: true },
      ),
    );
  }

  async me(accessToken: string) {
    return firstValueFrom(
      this.httpClient.get<IUserProfile>(this.meUrl, {
        headers: new HttpHeaders({ Authorization: `Bearer ${accessToken}` }),
        withCredentials: true,
      }),
    );
  }
}
