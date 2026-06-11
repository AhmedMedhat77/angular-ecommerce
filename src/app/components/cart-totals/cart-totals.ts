import { Component, computed, inject, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/context/cart.service';

@Component({
  selector: 'app-cart-totals',
  imports: [MatIcon, RouterLink],
  templateUrl: './cart-totals.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class CartTotals {
  private cartService = inject(CartService);

  readonly totalItems = this.cartService.totalItems;
  readonly totalPrice = this.cartService.totalPrice;
  readonly totalSavings = this.cartService.totalSavings;
  readonly originalTotal = computed(() => (this.totalPrice() + this.totalSavings()).toFixed(2));

  clearCart = output<void>();
}
