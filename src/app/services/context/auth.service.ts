import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoginResponse } from '../../interfaces/login';
import { Login } from '../login.service';

const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginService = inject(Login);

  private userSubject: BehaviorSubject<ILoginResponse | null>;

  currentUser$: Observable<ILoginResponse | null>;

  constructor() {
    const stored = localStorage.getItem(USER_KEY);
    const initial = stored ? (JSON.parse(stored) as ILoginResponse) : null;
    this.userSubject = new BehaviorSubject<ILoginResponse | null>(initial);
    this.currentUser$ = this.userSubject.asObservable();
  }

  get currentUser(): ILoginResponse | null {
    return this.userSubject.getValue();
  }

  login(user: ILoginResponse) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem(USER_KEY);
    this.userSubject.next(null);
  }

  private refreshPromise: Promise<ILoginResponse | null> | null = null;

  async refreshToken(): Promise<ILoginResponse | null> {
    const user = this.currentUser;
    if (!user?.refreshToken) {
      this.logout();
      return null;
    }

    if (!this.refreshPromise) {
      this.refreshPromise = this.loginService
        .refresh(user.refreshToken)
        .then((tokens) => {
          const updated = { ...user, ...tokens };
          localStorage.setItem(USER_KEY, JSON.stringify(updated));
          this.userSubject.next(updated);
          return updated;
        })
        .catch(() => {
          this.logout();
          return null;
        })
        .finally(() => {
          this.refreshPromise = null;
        });
    }

    return this.refreshPromise;
  }
}
