import { Routes } from '@angular/router';

export const FINANCIAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/financial-home/financial-home.component').then(m => m.FinancialHomeComponent)
  }
];