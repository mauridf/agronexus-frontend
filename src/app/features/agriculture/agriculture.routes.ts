import { Routes } from '@angular/router';

export const AGRICULTURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/agriculture-home/agriculture-home').then(m => m.AgricultureHome)
  }
];