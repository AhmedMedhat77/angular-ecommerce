import { Routes } from '@angular/router';
import { About } from './screens/about/about';
import { Cart } from './screens/cart/cart';
import { Home } from './screens/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'cart',
    component: Cart,
  },
];
