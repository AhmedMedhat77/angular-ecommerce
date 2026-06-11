import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoginResponse } from '../../interfaces/login';

const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
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
}
