import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },,
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginPage),
  },
    {
    path: 'otp',
    loadComponent: () => import('./pages/otp/otp').then(m => m.OtpPage),
  },
  {
    path: 'banking',
    loadComponent: () =>
      import('./pages/banking/banking').then(m => m.BankingPage),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./pages/voice/voice').then(m => m.VoicePage),
  },
];
