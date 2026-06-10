import { Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { IProduct } from '../../../interfaces/products/products';
import { CartService } from '../../services/cart.service';
import { Products } from '../../services/products';

@Component({
  selector: 'app-product-details',
  imports: [MatIcon],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private readonly productsService = inject(Products);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly cartService = inject(CartService);
  private readonly productId = this.route.snapshot.paramMap.get('id');

  product = signal<IProduct | null>(null);
  selectedImage = signal<string>('');

  discountedPrice = computed(() => {
    const p = this.product();
    if (!p) return 0;
    return p.price / (1 - p.discountPercentage / 100);
  });

  discountLabel = computed(() => {
    const p = this.product();
    if (!p) return '0';
    return p.discountPercentage.toFixed(0);
  });

  ratingStars = computed(() => {
    const p = this.product();
    if (!p) return [];
    return Array.from({ length: 5 }, (_, i) => i + 1 <= Math.round(p.rating));
  });

  isInCart = computed(() => {
    const p = this.product();
    if (!p) return false;
    return this.cartService.isSelected(p.id);
  });

  async getProductById() {
    if (this.productId) {
      const product = await this.productsService.getProductById(this.productId);
      this.product.set(product);
      this.selectedImage.set(product.thumbnail);
    }
  }

  addToCart() {
    const p = this.product();
    if (p) this.cartService.addToCart(p);
  }

  removeFromCart() {
    const p = this.product();
    if (p) this.cartService.removeFromCart(p.id);
  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.getProductById();
  }
}
