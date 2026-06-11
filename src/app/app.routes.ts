import { Routes } from '@angular/router';
import { About } from './screens/about/about';
import { Cart } from './screens/cart/cart';
import { Checkout } from './screens/checkout/checkout';
import { Home } from './screens/home/home';
import { Login } from './screens/login/login';
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
    path: 'checkout',
    component: Checkout,
  },
  {
    path: 'product-details/:id',
    component: ProductDetails,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
