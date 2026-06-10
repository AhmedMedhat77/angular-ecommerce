import { Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild, effect, untracked } from '@angular/core';
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
  private isFetching = false;

  products = this.productService.products;
  loading = this.productService.loading;
  loadingNext = this.productService.loadingNext;
  totalProducts = this.productService.totalProducts;
  hasMore = this.productService.hasMore;
  skeletonItems = this.productService.skeletonItems;
  showCategories = signal(false);
  sentinel = viewChild<ElementRef>('sentinel');
  scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  constructor() {
    effect(() => {
      this.productService.searchQuery();
      this.productService.selectedCategories();

      untracked(() => {
        const container = this.scrollContainer()?.nativeElement;
        if (container && window.innerWidth >= 1024) {
          container.scrollTop = 0;
        } else if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0 });
        }
      });
    });
  }

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
        if (entries[0].isIntersecting) {
          this.loadMore();
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 400px 0px',
      }
    );
    this.observer.observe(this.sentinel()?.nativeElement!);
  }

  private async loadMore() {
    if (this.isFetching || !this.hasMore() || this.loading() || this.loadingNext()) return;
    this.isFetching = true;

    try {
      await this.productService.fetchNext();
    } finally {
      this.isFetching = false;
    }

    if (this.hasMore()) {
      const sentinelEl = this.sentinel()?.nativeElement;
      if (sentinelEl && this.observer) {
        this.observer.unobserve(sentinelEl);
        this.observer.observe(sentinelEl);
      }
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
