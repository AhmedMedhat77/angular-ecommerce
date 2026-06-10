import { Injectable, signal } from '@angular/core';
import { ICategory } from '../../interfaces/categories/categories.interface';

@Injectable({
  providedIn: 'root',
})
export class Categories {
  isLoading = signal(false);
  total = signal(0);

  private categoriesURL = 'https://dummyjson.com/products/categories';

  async getAll(): Promise<ICategory[]> {
    try {
      this.isLoading.set(true);
      const res = await fetch(this.categoriesURL);
      const data = await res.json();
      this.isLoading.set(false);
      return data;
    } catch (error) {
      this.isLoading.set(false);
      return [];
    } finally {
      this.isLoading.set(false);
    }
  }

  async getProducts(category: string): Promise<ICategory | []> {
    try {
      this.isLoading.set(true);
      const res = await fetch(`https://dummyjson.com/products/category/${category}`);
      const data = await res.json();
      this.isLoading.set(false);
      return data;
    } catch (error) {
      this.isLoading.set(false);
      return [];
    } finally {
      this.isLoading.set(false);
    }
  }
}
