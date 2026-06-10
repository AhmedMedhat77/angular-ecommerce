import { Component, computed, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { IProduct } from '../../products';

@Component({
  selector: 'app-product-card',
  imports: [MatCard, MatCardContent],
  templateUrl: './product-card.html',
  styles: `
    :host {
      display: block;
    }

    mat-card {
      overflow: hidden;
      border-radius: 16px;
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
      cursor: pointer;
    }

    mat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    }

    .image-container {
      position: relative;
      background: #f5f5f5;
      overflow: hidden;
    }

    .image-container img {
      transition: transform 0.3s ease;
    }

    mat-card:hover .image-container img {
      transform: scale(1.05);
    }

    .discount-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #e91e63;
      color: white;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 8px;
    }
  `,
})
export class ProductCard {
  readonly product = input.required<IProduct>();

  discountedPrice = computed(
    () => this.product().price / (1 - this.product().discountPercentage / 100),
  );

  ratingStars = computed(() =>
    Array.from({ length: 5 }, (_, i) => i + 1 <= Math.round(this.product().rating)),
  );

  discountLabel = computed(() => this.product().discountPercentage.toFixed(0));
}
