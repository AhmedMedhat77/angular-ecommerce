import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Products } from '../../services/products';
import { AppCart } from '../app-cart/app-cart';
import { Search } from '../search/search';

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
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.2);
    }
  `,
})
export class Navbar {
  private products = inject(Products);

  menuOpen = signal(false);

  navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
  ];

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  onSearch(value: string) {
    this.products.search(value);
  }
}
