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

  products = this.productService.products;
  loading = this.productService.loading;
  loadingNext = this.productService.loadingNext;
  totalProducts = this.productService.totalProducts;
  hasMore = this.productService.hasMore;
  skeletonItems = this.productService.skeletonItems;
  showCategories = signal(false);
  sentinel = viewChild<ElementRef>('sentinel');
  scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  private isSentinelIntersecting = false;

  constructor() {
    // Scroll container to top when filters or search queries change
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

    // Handle lazy loading when loading finishes but sentinel is still intersecting
    effect(() => {
      const loading = this.loading();
      const loadingNext = this.loadingNext();
      const hasMore = this.hasMore();

      if (!loading && !loadingNext && hasMore && this.isSentinelIntersecting) {
        untracked(() => {
          this.productService.fetchNext();
        });
      }
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
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        this.isSentinelIntersecting = entry.isIntersecting;

        if (entry.isIntersecting && !this.loading() && !this.loadingNext() && this.hasMore()) {
          this.productService.fetchNext();
        }
      },
      {
        root: isMobile ? null : (this.scrollContainer()?.nativeElement ?? null),
        rootMargin: '0px 0px 400px 0px',
      }
    );
    this.observer.observe(this.sentinel()?.nativeElement!);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
