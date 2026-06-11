import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CartService } from '../../services/context/cart.service';
import { AuthService } from '../../services/context/auth.service';
import { Login } from '../../services/login.service';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, MatIcon, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly loginService = inject(Login);

  readonly cartItems = this.cartService.cartItems;
  readonly totalItems = this.cartService.totalItems;
  readonly totalPrice = this.cartService.totalPrice;
  readonly totalSavings = this.cartService.totalSavings;
  readonly originalTotal = signal('');

  form: CheckoutForm;
  processing = signal(false);
  orderPlaced = signal(false);
  loadingProfile = signal(false);

  private formatExpiryDate(raw: string): string {
    const clean = raw.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 2) return clean.slice(0, 2) + '/' + clean.slice(2);
    return clean;
  }

  constructor() {
    const user = this.authService.currentUser;
    this.form = {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      address: '',
      city: '',
      zip: '',
      country: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    };
    this.originalTotal.set((this.totalPrice() + this.totalSavings()).toFixed(2));
    this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    const token = this.authService.currentUser?.accessToken;
    if (!token) return;
    this.loadingProfile.set(true);
    try {
      const profile = await this.loginService.me(token);
      this.form.firstName = profile.firstName;
      this.form.lastName = profile.lastName;
      this.form.email = profile.email;
      this.form.address = profile.address.address;
      this.form.city = profile.address.city;
      this.form.zip = profile.address.postalCode;
      this.form.country = profile.address.country;
      this.form.cardNumber = profile.bank.cardNumber;
      this.form.expiry = this.formatExpiryDate(profile.bank.cardExpire);
    } catch {
    } finally {
      this.loadingProfile.set(false);
    }
  }

  get formValid(): boolean {
    return (
      this.form.firstName.trim() !== '' &&
      this.form.lastName.trim() !== '' &&
      this.form.email.trim() !== '' &&
      this.form.address.trim() !== '' &&
      this.form.city.trim() !== '' &&
      this.form.zip.trim() !== '' &&
      this.form.country.trim() !== '' &&
      this.form.cardNumber.replace(/\s/g, '').length === 16 &&
      this.form.expiry.length === 5 &&
      this.form.cvv.length === 3
    );
  }

  formatCardNumber() {
    const raw = this.form.cardNumber.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    this.form.cardNumber = parts ? parts.join(' ') : '';
  }

  formatExpiry() {
    let raw = this.form.expiry.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    this.form.expiry = raw;
  }

  formatCvv() {
    this.form.cvv = this.form.cvv.replace(/\D/g, '').slice(0, 3);
  }

  async placeOrder() {
    if (!this.formValid) return;
    this.processing.set(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.cartService.clearCart();
    this.processing.set(false);
    this.orderPlaced.set(true);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
