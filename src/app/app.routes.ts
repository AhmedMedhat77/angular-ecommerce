import { Routes } from '@angular/router';
import { About } from './screens/about/about';
import { Cart } from './screens/cart/cart';
import { Home } from './screens/home/home';
import { ProductDetails } from './screens/product-details/product-details';

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
  {
    path: 'product-details/:id',
    component: ProductDetails,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
