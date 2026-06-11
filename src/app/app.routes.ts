import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { profileGuard } from './guards/profile.guard';
import { About } from './screens/about/about';
import { Cart } from './screens/cart/cart';
import { Checkout } from './screens/checkout/checkout';
import { Home } from './screens/home/home';
import { Login } from './screens/login/login';
import { ProductDetails } from './screens/product-details/product-details';
import { Profile } from './screens/profile/profile';

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
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [profileGuard],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
