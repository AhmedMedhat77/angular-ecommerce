import { computed, Injectable, signal } from '@angular/core';
import { IProduct } from '../../interfaces/products/products';

interface ProductsResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class Products {
  products = signal<IProduct[]>([]);
  loading = signal(false);
  loadingNext = signal(false);
  totalProducts = signal(0);
  searchQuery = signal('');
  limit = signal(9);
  private skip = signal(0);

  private productURL = computed(() => {
    const q = this.searchQuery();
    const base = q
      ? `https://dummyjson.com/products/search?q=${q}`
      : `https://dummyjson.com/products`;
    return `${base}?limit=${this.limit()}&skip=${this.skip()}`;
  });

  hasMore = computed(() => this.skip() + this.limit() < this.totalProducts());

  skeletonItems = computed(() => Array.from({ length: this.limit() }, () => ({})));

  async fetchProducts(append = false): Promise<void> {
    if (append) this.loadingNext.set(true);
    else this.loading.set(true);

    try {
      const res = await fetch(this.productURL());
      const data: ProductsResponse = await res.json();
      this.totalProducts.set(data.total);

      if (append) {
        this.products.update((list) => [...list, ...data.products]);
      } else {
        this.products.set(data.products);
      }
    } catch {
      this.totalProducts.set(0);
    } finally {
      this.loading.set(false);
      this.loadingNext.set(false);
    }
  }

  async fetchNext(): Promise<void> {
    if (!this.hasMore()) return;
    this.skip.update((s) => s + this.limit());
    await this.fetchProducts(true);
  }

  async search(query: string): Promise<void> {
    this.searchQuery.set(query);
    this.skip.set(0);
    await this.fetchProducts(false);
  }

  async getProductById(id: string): Promise<IProduct> {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    return res.json();
  }
}
