import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ILoginResponse, IRefreshResponse } from '../interfaces/login';

@Injectable({
  providedIn: 'root',
})
export class Login {
  private readonly httpClient = inject(HttpClient);
  private readonly loginUrl = 'https://dummyjson.com/auth/login';
  private readonly refreshUrl = 'https://dummyjson.com/auth/refresh';

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
}
