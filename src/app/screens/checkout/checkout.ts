import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

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

  readonly cartItems = this.cartService.cartItems;
  readonly totalItems = this.cartService.totalItems;
  readonly totalPrice = this.cartService.totalPrice;
  readonly totalSavings = this.cartService.totalSavings;
  readonly originalTotal = signal('');

  form: CheckoutForm = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  };

  processing = signal(false);
  orderPlaced = signal(false);

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

  constructor() {
    this.originalTotal.set((this.totalPrice() + this.totalSavings()).toFixed(2));
  }
}
