import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductCard } from './components/product-card/product-card';
import { HttpClient } from '@angular/common/http';
import { SkeltonProductCard } from './components/skelton-product-card/skelton-product-card';

export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  thumbnail: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

interface ProductsResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}

@Component({
  selector: 'app-root',
  imports: [ProductCard, SkeltonProductCard],
  template: `
    <main class="p-4">
      <div class="px-2 pt-2 pb-6">
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <p class="text-sm text-gray-400 mt-1">
          {{ products().length }} of {{ totalProducts() }} items
        </p>
      </div>

      <div class="grid grid-cols-3 gap-4 p-2">
        @for (product of products(); track product.id) {
          <app-product-card [product]="product" />
        }

        @if (loading() || loadingNext()) {
          @for (_ of skeletonItems(); track $index) {
            <app-skelton-product-card />
          }
        }
      </div>

      @if (!hasMore()) {
        <p class="text-center text-sm text-gray-400 py-8">No more products</p>
      }
    </main>
  `,
  styles: [],
  providers: [],
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private limit = signal(9);
  private skip = signal(0);

  private apiUrl = computed(
    () => `https://dummyjson.com/products?limit=${this.limit()}&skip=${this.skip()}`,
  );

  products = signal<IProduct[]>([]);
  loading = signal(true);
  loadingNext = signal(false);
  totalProducts = signal(0);

  hasMore = computed(() => this.skip() + this.limit() < this.totalProducts());

  readonly skeletonItems = computed(() => Array.from({ length: this.limit() }, () => ({})));
  readonly starsSkeleton = [1, 2, 3, 4, 5];

  private fetchProducts(append = false): void {
    if (append) {
      this.loadingNext.set(true);
    }

    this.http.get<ProductsResponse>(this.apiUrl()).subscribe((data) => {
      if (append) {
        this.products.update((list) => [...list, ...data.products]);
      } else {
        this.products.set(data.products);
      }
      this.totalProducts.set(data.total);
      this.loading.set(false);
      this.loadingNext.set(false);
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.setupScrollListener();
  }

  private setupScrollListener(): void {
    window.addEventListener('scroll', () => {
      if (this.loading() || this.loadingNext() || !this.hasMore()) return;

      const threshold = 400;
      const position = window.innerHeight + window.scrollY;
      const bottom = document.body.offsetHeight - threshold;

      if (position >= bottom) {
        this.skip.update((s) => s + this.limit());
        this.fetchProducts(true);
      }
    });
  }
}
