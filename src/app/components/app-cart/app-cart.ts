import { Component, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-app-cart',
  imports: [MatIconModule],
  templateUrl: './app-cart.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AppCart {
  private cartService = inject(CartService);

  counter = signal<number>(0);

  constructor() {
    effect(() => {
      this.counter.set(this.cartService.totalItems());
    });
  }
}
