import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Products } from '../../services/products';
import { ProductCard } from '../product-card/product-card';
import { SkeltonProductCard } from '../skelton-product-card/skelton-product-card';
import { CategiesList } from '../categies-list/categies-list';

@Component({
  selector: 'app-products-list',
  imports: [ProductCard, SkeltonProductCard, RouterLink, MatIconModule, CategiesList],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  private productService = inject(Products);

  products = this.productService.products;
  loading = this.productService.loading;
  loadingNext = this.productService.loadingNext;
  totalProducts = this.productService.totalProducts;
  hasMore = this.productService.hasMore;
  skeletonItems = this.productService.skeletonItems;
  showCategories = signal(false);

  toggleCategories() {
    this.showCategories.update((v) => !v);
  }

  async filterByCategories(categories: string[]) {
    await this.productService.filterByCategories(categories);
  }

  ngOnInit(): void {
    this.productService.fetchProducts();
    this.setupScrollListener();
  }

  private setupScrollListener(): void {
    window.addEventListener('scroll', () => {
      if (this.loading() || this.loadingNext() || !this.hasMore()) return;

      const threshold = 400;
      const position = window.innerHeight + window.scrollY;
      const bottom = document.body.offsetHeight - threshold;

      if (position >= bottom) {
        this.productService.fetchNext();
      }
    });
  }
}
