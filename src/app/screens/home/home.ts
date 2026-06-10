import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductCard } from '../../components/product-card/product-card';
import { SkeltonProductCard } from '../../components/skelton-product-card/skelton-product-card';
import { IProduct } from '../../products';

interface ProductsResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}

@Component({
  selector: 'app-home',
  imports: [ProductCard, SkeltonProductCard],
  templateUrl: './home.html',
  styles: ``,
})
export class Home implements OnInit {
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
