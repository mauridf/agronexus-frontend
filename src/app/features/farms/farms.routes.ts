import { Routes } from '@angular/router';

export const FARMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/farm-list/farm-list').then(m => m.FarmList)
  }
];