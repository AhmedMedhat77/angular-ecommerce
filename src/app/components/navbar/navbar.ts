import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Products } from '../../services/products';
import { AppCart } from '../app-cart/app-cart';
import { Search } from '../search/search';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  imports: [AppCart, RouterLink, RouterLinkActive, Search],
  templateUrl: './navbar.html',
  styles: `
    :host {
      display: block;
    }

    :host ::ng-deep .nav-active {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.2);
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
