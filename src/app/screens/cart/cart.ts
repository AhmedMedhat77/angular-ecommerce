import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { CartTotals } from '../../components/cart-totals/cart-totals';

@Component({
  selector: 'app-cart',
  imports: [CartTotals, RouterLink, MatIconModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private cartService = inject(CartService);

  products = this.cartService.cartItems;
  totalItems = this.cartService.totalItems;

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
