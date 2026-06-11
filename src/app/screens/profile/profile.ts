import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/context/auth.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly authService = inject(AuthService);

  readonly user = toSignal(this.authService.currentUser$);

  logout(): void {
    this.authService.logout();
  }
}
