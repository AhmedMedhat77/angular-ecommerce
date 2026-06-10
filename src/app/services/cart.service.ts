import { computed, Injectable, signal } from '@angular/core';
import { IProduct } from '../../interfaces/products/products';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<IProduct[]>([]);

  // Public readonly computed signal for UI (prevents external mutation)
  readonly cartItems = computed(() => this.items());

  // Public computed signal for UI
  readonly totalItems = computed(() => this.items().length);
  readonly totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.price, 0),
  );
  readonly totalSavings = computed(() =>
    this.items().reduce(
      (sum, item) =>
        sum +
        (item.price / (1 - item.discountPercentage / 100) - item.price),
      0,
    ),
  );

  isSelected(id: number): boolean {
    return this.items().find((item) => item.id === id) ? true : false;
  }

  addToCart(product: IProduct) {
    if (!product.id) return;
    if (this.isSelected(product.id)) return this.removeFromCart(product.id);
    this.items.update((items) => [...items, product]);
  }

  removeFromCart(id: number) {
    if (!id) return;
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  clearCart() {
    this.items.set([]);
  }
}
