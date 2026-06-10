import { Component, OnInit, inject } from '@angular/core';
import { ProductCard } from '../../components/product-card/product-card';
import { SkeltonProductCard } from '../../components/skelton-product-card/skelton-product-card';
import { Products } from '../../services/products';

@Component({
  selector: 'app-home',
  imports: [ProductCard, SkeltonProductCard],
  templateUrl: './home.html',
  styles: ``,
})
export class Home implements OnInit {
  private productService = inject(Products);

  products = this.productService.products;
  loading = this.productService.loading;
  loadingNext = this.productService.loadingNext;
  totalProducts = this.productService.totalProducts;
  hasMore = this.productService.hasMore;
  skeletonItems = this.productService.skeletonItems;

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
