import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/app',
    pathMatch: 'full',
  },,
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginPage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup').then(m => m.SignupPage),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./pages/map/map').then(m => m.MapPage),
  },
];
