import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { CartTotals } from '../../components/cart-totals/cart-totals';

@Component({
  selector: 'app-cart',
  imports: [CartTotals, RouterLink, MatIcon],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private cartService = inject(CartService);

  cartItems = this.cartService.cartItems;
  totalItems = this.cartService.totalItems;

  getQuantity(id: number) {
    return this.cartService.getQuantity(id);
  }

  increment(id: number) {
    this.cartService.incrementQuantity(id);
  }

  decrement(id: number) {
    this.cartService.decrementQuantity(id);
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
