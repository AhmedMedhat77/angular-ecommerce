import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Login {
  private readonly httpClient = inject(HttpClient);
  private readonly url = 'https://dummyjson.com/auth/login';

  async login(username: string, password: string, expiresInMins?: number) {
    return firstValueFrom(
      this.httpClient.post(
        this.url,
        {
          username,
          password,
          expiresInMins, // by default it is 60
        },
        { withCredentials: true }, // to get refresh in headers
      ),
    );
  }
}
