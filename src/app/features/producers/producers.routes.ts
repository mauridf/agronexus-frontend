import { Routes } from '@angular/router';

export const PRODUCERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/producer-list/producer-list.component').then(m => m.ProducerListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/producer-form/producer-form.component').then(m => m.ProducerFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/producer-form/producer-form.component').then(m => m.ProducerFormComponent)
  }
];