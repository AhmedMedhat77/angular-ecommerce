import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/context/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.currentUser) {
    return router.parseUrl('/login');
  }

  return true;
};
