import { Routes } from '@angular/router';

export const FINANCIAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/financial-home/financial-home.component').then(m => m.FinancialHomeComponent)
  },
  {
    path: 'sales',
    loadComponent: () => import('./pages/sale-list/sale-list.component').then(m => m.SaleListComponent)
  },
  {
    path: 'sales/new',
    loadComponent: () => import('./pages/sale-form/sale-form.component').then(m => m.SaleFormComponent)
  }
];