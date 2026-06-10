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
  selectedCategories = signal<string[]>([]);
  limit = signal(9);
  private skip = signal(0);

  private productURL = computed(() => {
    const q = this.searchQuery();
    const cats = this.selectedCategories();

    if (q && cats.length === 1) {
      const slug = cats[0].toLowerCase().replace(/\s+/g, '-');
      return `https://dummyjson.com/products/category/${slug}/search?q=${q}`;
    }

    if (cats.length === 1) {
      const slug = cats[0].toLowerCase().replace(/\s+/g, '-');
      return `https://dummyjson.com/products/category/${slug}?limit=${this.limit()}&skip=${this.skip()}`;
    }

    if (cats.length > 1) {
      return `https://dummyjson.com/products?limit=100&skip=0`;
    }

    if (q) {
      return `https://dummyjson.com/products/search?q=${q}`;
    }

    return `https://dummyjson.com/products?limit=${this.limit()}&skip=${this.skip()}`;
  });

  hasMore = computed(() => {
    if (this.searchQuery()) return false;
    const cats = this.selectedCategories();
    if (cats.length > 1) return false;
    return this.skip() + this.limit() < this.totalProducts();
  });

  skeletonItems = computed(() => Array.from({ length: this.limit() }, () => ({})));

  async fetchProducts(append = false): Promise<void> {
    if (append) this.loadingNext.set(true);
    else this.loading.set(true);

    try {
      const res = await fetch(this.productURL());
      const data: ProductsResponse = await res.json();

      const cats = this.selectedCategories();
      const filtered =
        cats.length > 1
          ? data.products.filter((p) => cats.includes(p.category))
          : data.products;

      this.totalProducts.set(cats.length > 1 ? filtered.length : data.total);

      if (append) {
        this.products.update((list) => [...list, ...filtered]);
      } else {
        this.products.set(filtered);
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
    this.selectedCategories.set([]);
    this.skip.set(0);
    await this.fetchProducts(false);
  }

  async filterByCategories(categories: string[]): Promise<void> {
    this.selectedCategories.set(categories);
    this.skip.set(0);
    await this.fetchProducts(false);
  }

  async getProductById(id: string): Promise<IProduct> {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    return res.json();
  }
}
