import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/context/auth.service';
import { Login } from '../../services/login.service';
import { IUserProfile } from '../../interfaces/login';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly authService = inject(AuthService);
  private readonly loginService = inject(Login);

  readonly profile = signal<IUserProfile | null>(null);
  readonly loading = signal(true);

  constructor() {
    this.fetchProfile();
  }

  private async fetchProfile(): Promise<void> {
    const user = this.authService.currentUser;
    if (!user?.accessToken) {
      this.loading.set(false);
      return;
    }

    try {
      const data = await this.loginService.me(user.accessToken);
      this.profile.set(data);
    } catch {
      this.profile.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
