import { Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IProduct } from '../../../interfaces/products/products';
import { CartService } from '../../services/context/cart.service';
import { Products } from '../../services/products';

@Component({
  selector: 'app-product-details',
  imports: [MatIcon, RouterLink],
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
  loading = signal(true);
  notFound = signal(false);
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
    return Array.from({ length: 5 }, (_, i) => ({
      index: i,
      filled: i + 1 <= Math.round(p.rating),
    }));
  });

  isInCart = computed(() => {
    const p = this.product();
    if (!p) return false;
    return this.cartService.isSelected(p.id);
  });

  async getProductById() {
    if (!this.productId) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.notFound.set(false);
    try {
      const product = await this.productsService.getProductById(this.productId);
      this.product.set(product);
      this.selectedImage.set(product.thumbnail);
    } catch {
      this.notFound.set(true);
    } finally {
      this.loading.set(false);
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
