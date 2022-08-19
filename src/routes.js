import { lazy } from 'solid-js';

import Home from './pages/home';
import singleThread from './pages/singleThread';

export const routes = [
  {
    path: '/',
    component: Home,
  }, 
  {
    path: '/singlethread',
    component: singleThread,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
