import { Routes } from '@angular/router';

export const OPERATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/operations-home/operations-home.component').then(m => m.OperationsHomeComponent)
  }
];