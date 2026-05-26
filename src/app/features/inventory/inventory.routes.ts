import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/inventory-home/inventory-home.component').then(m => m.InventoryHomeComponent)
  },
  {
    path: 'inputs',
    loadComponent: () => import('./pages/input-list/input-list.component').then(m => m.InputListComponent)
  },
  {
    path: 'inputs/new',
    loadComponent: () => import('./pages/input-form/input-form.component').then(m => m.InputFormComponent)
  },
  {
    path: 'purchase',
    loadComponent: () => import('./pages/purchase-form/purchase-form.component').then(m => m.PurchaseFormComponent)
  },
  {
    path: 'stock',
    loadComponent: () => import('./pages/stock-list/stock-list.component').then(m => m.StockListComponent)
  }
];