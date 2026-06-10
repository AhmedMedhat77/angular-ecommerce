import { Routes } from '@angular/router';
import { About } from './screens/about/about';
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
];
