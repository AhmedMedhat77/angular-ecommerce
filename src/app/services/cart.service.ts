import { computed, Injectable, signal } from '@angular/core';
import { IProduct } from '../../interfaces/products/products';

export interface CartItem {
  product: IProduct;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  readonly cartItems = computed(() => this.items());
  readonly totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0),
  );
  readonly totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );
  readonly totalSavings = computed(() =>
    this.items().reduce(
      (sum, item) =>
        sum +
        (item.product.price / (1 - item.product.discountPercentage / 100) -
          item.product.price) *
          item.quantity,
      0,
    ),
  );

  getQuantity(id: number): number {
    return this.items().find((item) => item.product.id === id)?.quantity ?? 0;
  }

  isSelected(id: number): boolean {
    return this.items().some((item) => item.product.id === id);
  }

  addToCart(product: IProduct) {
    if (!product.id) return;
    const existing = this.items().find((item) => item.product.id === product.id);
    if (existing) {
      this.incrementQuantity(product.id);
    } else {
      this.items.update((items) => [...items, { product, quantity: 1 }]);
    }
  }

  incrementQuantity(id: number) {
    this.items.update((items) =>
      items.map((item) =>
        item.product.id === id
          ? { ...item, quantity: Math.min(item.quantity + 1, item.product.stock) }
          : item,
      ),
    );
  }

  decrementQuantity(id: number) {
    const item = this.items().find((i) => i.product.id === id);
    if (!item) return;
    if (item.quantity <= 1) {
      this.removeFromCart(id);
    } else {
      this.items.update((items) =>
        items.map((i) =>
          i.product.id === id ? { ...i, quantity: i.quantity - 1 } : i,
        ),
      );
    }
  }

  removeFromCart(id: number) {
    this.items.update((items) => items.filter((item) => item.product.id !== id));
  }

  clearCart() {
    this.items.set([]);
  }
}
