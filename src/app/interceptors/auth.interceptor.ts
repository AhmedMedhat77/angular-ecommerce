import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/context/auth.service';

const AUTH_URLS = ['/auth/login', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (AUTH_URLS.some((url) => req.url.includes(url))) {
    return next(req);
  }

  const authService = inject(AuthService);
  const user = authService.currentUser;

  let authReq = req;
  if (user?.accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${user.accessToken}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && user?.refreshToken) {
        return from(authService.refreshToken()).pipe(
          switchMap((refreshed) => {
            if (refreshed?.accessToken) {
              return next(
                req.clone({
                  setHeaders: { Authorization: `Bearer ${refreshed.accessToken}` },
                }),
              );
            }
            return throwError(() => error);
          }),
          catchError(() => throwError(() => error)),
        );
      }
      return throwError(() => error);
    }),
  );
};
