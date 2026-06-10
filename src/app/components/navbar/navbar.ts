import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppCart } from '../app-cart/app-cart';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
      color: #f59e0b;
      background-color: #fffbeb;
    }
  `,
})
export class Navbar {
  navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
  ];

  onSearch(query: Event) {
    const value = (query.target as HTMLInputElement).value;
    console.log('search query', value);
  }
}
