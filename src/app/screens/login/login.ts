import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Input } from '../../components/input/input';
import { Login as LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  imports: [Input, RouterLink, MatIconModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  passwordForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  username = this.passwordForm.controls.username;
  password = this.passwordForm.controls.password;

  usernameError(): string {
    if (this.username.hasError('required')) return 'Username is required';
    return '';
  }

  passwordError(): string {
    if (this.password.hasError('required')) return 'Password is required';
    return '';
  }

  async onSubmit(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const { username, password } = this.passwordForm.value;
      await this.loginService.login(username!, password!);
      this.router.navigateByUrl('/');
    } catch {
      this.errorMessage.set('Invalid username or password');
    } finally {
      this.loading.set(false);
    }
  }
}
