import { Component, computed, inject, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { IProduct } from '../../../interfaces/products/products';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [MatCard, MatCardContent, MatIcon],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
})
export class ProductCard {
  private readonly cartService = inject(CartService);
  readonly product = input.required<IProduct>();

  isInCart = computed(() => this.cartService.isSelected(this.product().id));

  discountedPrice = computed(
    () => this.product().price / (1 - this.product().discountPercentage / 100),
  );

  ratingStars = computed(() =>
    Array.from({ length: 5 }, (_, i) => i + 1 <= Math.round(this.product().rating)),
  );

  discountLabel = computed(() => this.product().discountPercentage.toFixed(0));

  onAddToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(this.product());
  }
}
