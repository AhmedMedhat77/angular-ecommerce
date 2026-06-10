import { Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
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
export class ProductsList implements OnInit, OnDestroy {
  private productService = inject(Products);
  private observer: IntersectionObserver | null = null;

  products = this.productService.products;
  loading = this.productService.loading;
  loadingNext = this.productService.loadingNext;
  totalProducts = this.productService.totalProducts;
  hasMore = this.productService.hasMore;
  skeletonItems = this.productService.skeletonItems;
  showCategories = signal(false);
  sentinel = viewChild<ElementRef>('sentinel');
  scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  toggleCategories() {
    this.showCategories.update((v) => !v);
  }

  async filterByCategories(categories: string[]) {
    await this.productService.filterByCategories(categories);
  }

  ngOnInit(): void {
    this.productService.fetchProducts();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !this.loading() && !this.loadingNext() && this.hasMore()) {
          this.productService.fetchNext();
        }
      },
      { root: this.scrollContainer()?.nativeElement ?? null, rootMargin: '0px 0px 400px 0px' }
    );
    this.observer.observe(this.sentinel()?.nativeElement!);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
