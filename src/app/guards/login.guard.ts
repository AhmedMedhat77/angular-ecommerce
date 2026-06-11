import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/context/auth.service';

export const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser) {
    return router.parseUrl('/');
  }

  return true;
};
