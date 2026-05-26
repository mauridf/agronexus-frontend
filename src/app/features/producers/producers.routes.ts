import { Routes } from '@angular/router';

export const PRODUCERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/producer-list/producer-list').then(m => m.ProducerList)
  }
];