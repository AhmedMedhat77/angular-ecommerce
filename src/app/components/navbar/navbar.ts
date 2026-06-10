import { Component } from '@angular/core';
import { AppCart } from '../app-cart/app-cart';
import { RouterLink } from '@angular/router';
import { Search } from '../search/search';

@Component({
  selector: 'app-navbar',
  imports: [AppCart, RouterLink, Search],
  templateUrl: './navbar.html',
})
export class Navbar {}
