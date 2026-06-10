import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppCart } from '../app-cart/app-cart';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Search } from '../search/search';
import { Products } from '../../services/products';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  imports: [AppCart, MatIconModule, RouterLink, RouterLinkActive, Search],
  templateUrl: './navbar.html',
  styles: `
    :host {
      display: block;
    }

    :host ::ng-deep .nav-active {
      color: #f59e0b;
      background-color: #fffbeb;
    }
  `,
})
export class Navbar {
  private products = inject(Products);
  navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
  ];

  onSearch(value: string) {
    this.products.search(value);
  }
}
